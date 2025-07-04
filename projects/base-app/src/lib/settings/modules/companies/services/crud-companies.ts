import { company } from './../interfaces/company';
import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../system';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager<company> {
  constructor() {
    super();
    super.endpoint = 'companies';
  }

  getCompanies(): company[] {
    return [
      {
        _id: 'c001',
        name: 'TechNova Solutions',
        legalId: '3-101-234567',
        email: 'contact@technova.com',
        phone: '+506 4000 1111',
        website: 'https://technova.com',
        logoUrl:
          'https://fedit.com/wp-content/uploads/2023/07/tecnova-logo.jpg',
        address: 'San José, Costa Rica',
        ownerId: 'u001',
        settings: { timezone: 'America/Costa_Rica' },
      },
      {
        _id: 'c002',
        name: 'GreenCore Industries',
        legalId: '3-102-345678',
        email: 'info@greencore.cr',
        phone: '+506 4000 2222',
        website: 'https://greencore.cr',
        logoUrl:
          'https://media.licdn.com/dms/image/v2/D4E0BAQErJg5f-LylOA/company-logo_200_200/company-logo_200_200/0/1732114160811/greencore_logo?e=2147483647&v=beta&t=mxKV1IZNPHuBBlbFetk9CS5Y4yNVAAK1yFX0i6qpG3Y',
        address: 'Heredia, Costa Rica',
        ownerId: 'u002',
        settings: { preferredLanguage: 'es' },
      },
      {
        _id: 'c003',
        name: 'Oceanix Global',
        legalId: '3-103-456789',
        email: 'hello@oceanix.com',
        phone: '+506 4000 3333',
        website: 'https://oceanix.com',
        logoUrl:
          'https://panorama.solutions/sites/default/files/organisation-logo/oceanic-global-logo-.png',
        address: 'Puntarenas, Costa Rica',
        ownerId: 'u003',
      },
      {
        _id: 'c004',
        name: 'Nimbus Analytics',
        legalId: '3-104-567890',
        email: 'support@nimbus.ai',
        phone: '+506 4000 4444',
        website: 'https://nimbus.ai',
        logoUrl:
          'https://media.licdn.com/dms/image/v2/D4D0BAQHbUqHdV1TSmQ/company-logo_200_200/company-logo_200_200/0/1711028558156/nimbus_intelligence_logo?e=2147483647&v=beta&t=62op9oKdt5knZNbF-bFVHXRADP5z5q4C6QLa2KeBEQ4',
        address: 'Cartago, Costa Rica',
        ownerId: 'u004',
        settings: { notifications: true },
      },
      {
        _id: 'c005',
        name: 'Vertex Dynamics',
        legalId: '3-105-678901',
        email: 'admin@vertex.com',
        phone: '+506 4000 5555',
        website: 'https://vertex.com',
        logoUrl: '/assets/logos/vertex.svg',
        address: 'Alajuela, Costa Rica',
      },
      {
        _id: 'c006',
        name: 'FutureWorks Inc.',
        legalId: '3-106-789012',
        email: 'team@futureworks.io',
        phone: '+506 4000 6666',
        website: 'https://futureworks.io',
        logoUrl: '/assets/logos/futureworks.svg',
        address: 'Guanacaste, Costa Rica',
        ownerId: 'u006',
      },
      {
        _id: 'c007',
        name: 'SolarEdge Corp',
        legalId: '3-107-890123',
        email: 'solar@solaredge.com',
        phone: '+506 4000 7777',
        website: 'https://solaredge.com',
        logoUrl: '/assets/logos/solaredge.png',
        address: 'Limón, Costa Rica',
        ownerId: 'u007',
      },
      {
        _id: 'c008',
        name: 'QuantumSoft',
        legalId: '3-108-901234',
        email: 'dev@quantumsoft.dev',
        phone: '+506 4000 8888',
        website: 'https://quantumsoft.dev',
        logoUrl: '/assets/logos/quantumsoft.svg',
        address: 'Tamarindo, Costa Rica',
      },
      {
        _id: 'c009',
        name: 'BluePeak Technologies',
        legalId: '3-109-012345',
        email: 'contact@bluepeak.com',
        phone: '+506 4000 9999',
        website: 'https://bluepeak.com',
        logoUrl: '/assets/logos/bluepeak.svg',
        address: 'Escazú, Costa Rica',
        ownerId: 'u009',
        settings: { theme: 'dark' },
      },
      {
        _id: 'c010',
        name: 'EcoSphere Ventures',
        legalId: '3-110-123456',
        email: 'hello@ecosv.com',
        phone: '+506 4010 1010',
        website: 'https://ecosv.com',
        logoUrl: '/assets/logos/ecosphere.png',
        address: 'Santa Ana, Costa Rica',
        ownerId: 'u010',
      },
    ];
  }
}
