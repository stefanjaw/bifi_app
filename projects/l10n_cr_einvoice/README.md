# @avalantec/l10n_cr_einvoice

Costa Rica electronic invoicing (Factura Electrónica **V4.4**) localization module for the BiFi platform.

Regulatory authority: **Dirección General de Tributación (DGT)**  
Hacienda spec version: **V4.4** (effective June 2025)

This module extends `@avalantec/base-app`, `@avalantec/accounting`, and `@avalantec/inventory` via Angular's plugin slot system, and provides a full invoice lifecycle from form entry through Hacienda submission and async acceptance callback.

---

## Architecture Overview

The module has two layers that work in tandem:

### Frontend — `bifi_app/projects/l10n_cr_einvoice/`

An Angular library activated with a single call to `provideL10nCrEinvoice()` in the host app config. At init time it:

1. Registers five plugin components into existing form slots (contacts, product, UoM, discount, tax).
2. Adds three maintenance sub-modules (Settings, CondicionVenta, MedioPago) under `/settings/cr-einvoice/`.
3. Adds the main EInvoice sub-module under `/cr-einvoice/einvoices`.

### Backend — `bifi_app_be/src/modules/l10n_cr_einvoice/`

A Node.js/Express module with sub-modules for CondicionVenta, MedioPago, Settings, and EInvoice. Includes:

- **JsonBuilder** — assembles the Hacienda V4.4 JSON payload from the stored EInvoice document.
- **HaciendaAuth** — manages OAuth2 tokens (auto-refresh with 30 s safety margin).
- **HaciendaSubmission** — POSTs the payload and handles status polling.
- **Public callback route** — receives async acceptance/rejection notifications from Hacienda.

### Data flow

```
User → EInvoice Form → Backend (build JSON) → Hacienda API
                                                    ↓ (async)
                                           Callback → Status update
```

---

## Plugin System

`provideL10nCrEinvoice()` calls `provideAppInitializer(initializeL10nCrEinvoice)`, which runs at Angular startup and calls `PluginManager.register()` with five plugin components. Each plugin injects its host form via `PLUGIN_CONTEXT`, adds reactive form controls in `ngOnInit`, and patches those controls from the loaded entity via `effect()`.

### Registered Plugins

| Plugin                      | Slot                                | Form extended         | Fields added                                               |
| --------------------------- | ----------------------------------- | --------------------- | ---------------------------------------------------------- |
| `ContactCrPluginComponent`  | `contacts-form-general-information` | `ContactsForm`        | `crVatType`, `commercialName`, `crEconomicActivityCodes[]` |
| `ProductCrPluginComponent`  | `product-form-general-information`  | `ProductFormService`  | `codigoComercial`, `productKind`                           |
| `UomCrPluginComponent`      | `uom-form-general-information`      | `UomFormService`      | `crUnidadMedida`                                           |
| `DiscountCrPluginComponent` | `discount-form-general-information` | `DiscountFormService` | `crNaturalezaDescuento`                                    |
| `TaxCrPluginComponent`      | `tax-form-general-information`      | `TaxFormService`      | `crCodigo`, `crCodigoTarifa`, `crTarifa`                   |

The backend models for Contact, Product, UoM, Tax, and Discount were each extended with these fields — no new backend models were created. The fields live on the existing Mongoose schemas and are persisted transparently alongside the base model fields.

**Reset behaviour:** When the host navigates to a "create new" record (entity is absent), each plugin's `effect()` resets its own controls to defaults, preventing stale data from a previous edit session.

---

## Sub-Modules

### CondicionVenta (Maintenance)

Hacienda catalog for sale conditions (Nota 5).

|                       |                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Frontend route**    | `/settings/cr-einvoice/condicion-venta` (list, create, edit)                                               |
| **Backend endpoints** | `GET / POST / PUT / DELETE /api/cr-einvoice/condicion-venta`                                               |
| **Fields**            | `code` (String — Hacienda code, e.g. `"01"`), `description` (String, e.g. `"Contado"`), `active` (Boolean) |

Seeded codes: `01` Contado, `02` Crédito, `03` Consignación, `04` Apartado, `05` Arrendamiento con opción de compra, `06` Arrendamiento en función financiera, `07` Cobro a favor de un tercero, `08` Servicios prestados al Estado, `09` Pago del servicios prestado al Estado, `10` Venta a crédito a organismos internacionales, `11` Pago a organismos internacionales, `99` Otros.

---

### MedioPago (Maintenance)

Hacienda catalog for payment methods (Nota 6).

|                       |                                                             |
| --------------------- | ----------------------------------------------------------- |
| **Frontend route**    | `/settings/cr-einvoice/medio-pago` (list, create, edit)     |
| **Backend endpoints** | `GET / POST / PUT / DELETE /api/cr-einvoice/medio-pago`     |
| **Fields**            | `code` (String), `description` (String), `active` (Boolean) |

---

### Settings (Singleton)

One settings document is ever created (upsert pattern — `findOneAndUpdate` with `upsert: true`).

|                       |                                                                  |
| --------------------- | ---------------------------------------------------------------- |
| **Frontend route**    | `/settings/cr-einvoice/configuracion`                            |
| **Backend endpoints** | `GET /api/cr-einvoice/settings`, `PUT /api/cr-einvoice/settings` |

**Fields:**

| Field                   | Type                      | Description                                    |
| ----------------------- | ------------------------- | ---------------------------------------------- |
| `proveedorSistemas`     | String                    | Software vendor name (appears in Hacienda XML) |
| `haciendaUsername`      | String                    | ATV portal username                            |
| `haciendaPassword`      | String                    | ATV portal password                            |
| `certificateBase64`     | String                    | P12 certificate, base64-encoded                |
| `haciendaEnvironment`   | `production` \| `sandbox` | Controls which Hacienda API base URL is used   |
| `codigoEstablecimiento` | String (3 chars)          | Office/establishment code, default `001`       |
| `codigoPuntoVenta`      | String (5 chars)          | Point-of-sale terminal code, default `00001`   |
| `economicActivityCode`  | String                    | Emisor's primary CIIU activity code            |

---

### EInvoice (Main entity)

|                       |                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Frontend routes**   | `/cr-einvoice/einvoices` (list), `/cr-einvoice/einvoices/create`, `/cr-einvoice/einvoices/edit/:id` |
| **Backend endpoints** | `GET / POST / PUT / DELETE /api/cr-einvoice/einvoices`                                              |
| **Submit**            | `POST /api/cr-einvoice/einvoices/:id/submit`                                                        |
| **Status poll**       | `GET /api/cr-einvoice/einvoices/:id/status`                                                         |
| **Hacienda callback** | `POST /api/cr-einvoice/hacienda-callback` (public — no auth)                                        |

**Status lifecycle:**

```
draft → sent → received → accepted
                        → rejected
```

---

## EInvoice Data Model

### Header fields

| Field               | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `Clave`             | 50-character structured key — generated automatically on create (see below) |
| `NumeroConsecutivo` | 20-character structured string — generated automatically on create          |
| `FechaEmision`      | ISO 8601 date-time of emission                                              |
| `einvoiceType`      | `FE` \| `ND` \| `NC` \| `TE` \| `FEE` \| `FEC` \| `REP`                     |

### Emisor (from company settings + Contact)

`Nombre`, `Identificacion { Tipo, Numero }`, `NombreComercial`, `Ubicacion`, `Telefono`, `CorreoElectronico`

### Receptor (from selected Contact)

Same structure as Emisor, plus `codigoActividadReceptor` — selected from `contact.crEconomicActivityCodes` per invoice.

### Condicion / Pago

| Field              | Description                                                                      |
| ------------------ | -------------------------------------------------------------------------------- |
| `CondicionVentaId` | Reference to CondicionVenta document                                             |
| `PlazoCredito`     | Integer days — only required when `condicionVenta.code = "02"` (Crédito)         |
| `MedioPagoId`      | Reference to MedioPago document — stored in `ResumenFactura` per V4.4 change #36 |

### DetalleServicio (line items array)

Each line item:

| Field                           | Source                                   |
| ------------------------------- | ---------------------------------------- |
| `NumeroLinea`                   | Auto-incremented index                   |
| `PartidaArancelaria`            | Optional tariff code                     |
| `Codigo`                        | `product.codigoComercial` or product SKU |
| `Cantidad`                      | Line quantity                            |
| `UnidadMedida`                  | `uom.crUnidadMedida`                     |
| `Detalle`                       | Product description                      |
| `PrecioUnitario`                | Unit price                               |
| `MontoTotal`                    | Quantity × unit price                    |
| `SubTotal`                      | After applying discounts                 |
| `IVACobradoFabrica`             | Factory-collected VAT (if applicable)    |
| `BaseImponible`                 | Taxable base                             |
| `Impuesto.Codigo`               | `tax.crCodigo`                           |
| `Impuesto.Tarifa`               | `tax.crTarifa`                           |
| `Impuesto.CodigoTarifaIVA`      | `tax.crCodigoTarifa`                     |
| `Impuesto.Monto`                | Computed tax amount                      |
| `Impuesto.Exoneracion`          | Optional exoneration                     |
| `ImpuestoNeto`                  | Net tax after exoneration                |
| `MontoTotalLinea`               | Final line total                         |
| `Descuento.MontoDescuento`      | Discount amount                          |
| `Descuento.NaturalezaDescuento` | `discount.crNaturalezaDescuento`         |
| `Descuento.CodigoDescuento`     | Discount code                            |

### ResumenFactura (computed server-side)

`CodigoTipoMoneda`, `TotalMercExonerada`, `TotalGravado`, `TotalExonerado`, `TotalVenta`, `TotalVentaNeta`, `TotalImpuesto`, `TotalComprobante`. **Do not set these manually** — they are computed automatically on every create/update by the backend.

### OtrosCargos / Otros

Free-form arrays for additional charges and other information.

---

## NumeroConsecutivo and Clave Generation

Both fields are computed automatically on invoice creation and stored on the document.

### NumeroConsecutivo (20 characters)

```
[codigoEstablecimiento(3)][codigoPuntoVenta(5)][tipoComprobante(2)][counter(10)]
```

Example:

```
00100001010000002294
│││└────┘└┘└────────┘
│││  5     2    10
│││  POS  type counter
│└┘
│ 3-char establishment (from settings)
```

**tipoComprobante codes:** `FE→01`, `ND→02`, `NC→03`, `TE→04`, `FEC→08`, `FEE→09`, `REP→10`

The counter is **per `einvoiceType`** — each type has its own independent auto-increment sequence.

### Clave (50 characters)

```
[506(3)][dd(2)][mm(2)][yy(2)][cedulaEmisor(12)][consecutivo(20)][situacion(1)][security(8)]
```

Example:

```
50620052600310170237400100001010000002294179304372
│││└┘└┘└┘└──────────┘└──────────────────┘│└──────┘
│││ d  m  y  cedula(12)   consecutivo(20) s security(8)
└┘
506 = Costa Rica country code
```

**Cedula zero-padding rules (Nota 4.1):**

| `crVatType`            | Padding                |
| ---------------------- | ---------------------- |
| `01` Física            | 3 leading zeros prefix |
| `02` Jurídica          | 2 leading zeros prefix |
| `03` DIMEX / `04` NITE | Pad to 12 digits       |

`situacion` = `1` (Normal). `security` = random 8-digit number generated at creation time.

---

## Hacienda Integration

### Authentication — OAuth2 Resource Owner Password

- **Token URL:** `https://idp.comprobanteselectronicos.go.cr/auth/realms/rut/protocol/openid-connect/token`
- Params: `grant_type=password`, `client_id=api-prod`, `client_secret=` (empty), `scope=` (empty)
- Username and password are read from Settings at runtime.
- Tokens expire in **5 minutes**. `HaciendaAuthService` caches the token and auto-refreshes with a **30-second safety margin**.

### Environments

| Setting value | Base URL                                                           |
| ------------- | ------------------------------------------------------------------ |
| `production`  | `https://api.comprobanteselectronicos.go.cr/recepcion/v1/`         |
| `sandbox`     | `https://api.comprobanteselectronicos.go.cr/recepcion-sandbox/v1/` |

### Submission flow (`POST /api/cr-einvoice/einvoices/:id/submit`)

1. Backend loads the EInvoice document and the Settings singleton.
2. `JsonBuilder` assembles the V4.4 payload, including `fe_version: "4.4"`, `certificate`, and `token_user_name`.
3. A `callbackUrl` pointing to `POST /api/cr-einvoice/hacienda-callback` is embedded in the payload.
4. Payload is POSTed to `${haciendaBaseUrl}recepcion` with `Authorization: Bearer <token>`.
5. Invoice status is updated to `sent`.

### Status polling (`GET /api/cr-einvoice/einvoices/:id/status`)

Calls `GET ${haciendaBaseUrl}recepcion/${Clave}` and returns the raw `indEstado` from Hacienda.

### Async callback (`POST /api/cr-einvoice/hacienda-callback`)

- **Public route — no JWT authentication.** Registered before auth middleware in `app.ts`.
- Hacienda POSTs `{ clave, fecha, indEstado, respuestaXml }`.
- Backend finds the EInvoice by `Clave`, updates status to `accepted`, `rejected`, or `received`, and stores the full response.
- Responds HTTP 200. Hacienda retries 3 times on failure — the handler is idempotent.

---

## Developer Setup

1. **Activate the module** — add `provideL10nCrEinvoice()` to `app.config.ts` providers in the host application.
2. **Configure credentials** — navigate to `/settings/cr-einvoice/configuracion` and fill in:
   - Hacienda ATV username and password
   - P12 certificate (base64)
   - Software vendor name (`proveedorSistemas`)
   - Economic activity code
   - Set `haciendaEnvironment` to **`sandbox`** for testing
3. **Seed catalogs** — add CondicionVenta records at `/settings/cr-einvoice/condicion-venta` and MedioPago records at `/settings/cr-einvoice/medio-pago`.
4. **Backend URL** — ensure the `BACKEND_URL` environment variable is set so the Hacienda callback URL resolves correctly in production.
5. **Type generation** — run `npm run generate:types` inside `bifi_app_be/` after any model/DTO change.

---

## Field Mapping Reference

Quick-reference from BiFi source fields to Hacienda JSON fields:

| BiFi source                          | Hacienda JSON field                                           |
| ------------------------------------ | ------------------------------------------------------------- |
| `contact.crVatType`                  | `Emisor.Identificacion.Tipo` / `Receptor.Identificacion.Tipo` |
| `contact.commercialName`             | `Emisor.NombreComercial`                                      |
| `contact.crEconomicActivityCodes[n]` | `CodigoActividadReceptor` (selected per invoice)              |
| `settings.economicActivityCode`      | `CodigoActividadEmisor`                                       |
| `settings.proveedorSistemas`         | `ProveedorSistemas`                                           |
| `product.codigoComercial` (or SKU)   | `LineaDetalle.Codigo`                                         |
| `uom.crUnidadMedida`                 | `LineaDetalle.UnidadMedida`                                   |
| `tax.crCodigo`                       | `LineaDetalle.Impuesto.Codigo`                                |
| `tax.crCodigoTarifa`                 | `LineaDetalle.Impuesto.CodigoTarifaIVA`                       |
| `tax.crTarifa`                       | `LineaDetalle.Impuesto.Tarifa`                                |
| `discount.crNaturalezaDescuento`     | `LineaDetalle.Descuento.NaturalezaDescuento`                  |
| `condicionVenta.code`                | `CondicionVenta`                                              |
| `medioPago.code`                     | `ResumenFactura.MedioPago`                                    |

---

## Known Constraints and Gotchas

- **`informacionReferencia` not implemented** — reference document linking (e.g. linking a credit note to its original invoice) is deferred to a future release.
- **`PlazoCredito` is integer days** — V4.4 change #35 requires this as a plain integer, not a string.
- **`MedioPago` lives in `ResumenFactura`** — V4.4 change #36 moved it out of the header. Do not place it in the invoice header.
- **CondicionVenta code `99`** — Hacienda requires a `DetallCondicionVentaOtro` free-text field when code is `99`. This field is not currently surfaced in the form — it is future work.
- **PDF field is optional** — the JSON payload supports an embedded PDF, but this module does not generate one.
- **Callback route must be public** — `POST /api/cr-einvoice/hacienda-callback` is registered in `app.ts` before the JWT auth middleware. Do not move it behind the auth guard.
- **Per-type sequence counters** — `NumeroConsecutivo` counters are independent per `einvoiceType`. FE, NC, ND, TE, FEC, FEE, and REP each have their own auto-increment.
