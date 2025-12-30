import { company, country, user } from '@avalantec/base-app/interfaces';
import { file } from '@avalantec/base-app/resource';

export interface invoiceComment {
  description: string;
  createdAt?: string;
  createdBy: user;
  active: boolean;
  status: 'DRAFT' | 'CANCELLED' | 'DONE';
}

export interface invoicePDF {
  file: file;
  extractedData: {
    header: {
      invoiceNumber: string;
      date: string;
      countryId: country;
      companyId: company;
      address?: string;
      phone?: string;
      email?: string;
      total: number;
      currency?: string;
    };
    lines: {
      lineNumber: string;
      countryId: country;
      currency?: string;
      description: string;
      quantity: number;
      price: number;
      subtotal: number;
      customsClassification: string;
      hsCode?: string;
      customsChapter?: string;
      customsHeading?: string;
      customsSubheading?: string;
      chapterDescription?: string;
      headingDescription?: string;
      subheadingDescription?: string;
      recordNumber?: number;
      tariff?: {
        code?: string;
        chapter: string;
        heading: string;
        subheading: string;
        userDescription?: string;
        description?: string;
        rateOfDuty?: number;
        unitOfMeasurement?: string;
        tax?: number;
      };
    }[];
  };
}

export interface invoice {
  comments?: invoiceComment[];
  pdf: invoicePDF;
  status: 'PROCESSING_PDF' | 'ERROR_JSON' | 'DATA_PROCESSED' | 'COMPLETE';
}

export interface shipping {
  _id: string;
  name: string;
  origin: country;
  destination: country;
  createdBy: user;
  updatedBy?: user;
  status: 'UPLOADING' | 'ERROR' | 'PDF_PROCESSED' | 'BCD_SENT';
  stage: 'HS_CODES' | 'TARIFF_CODES' | 'GROUPING' | 'SUMMARY' | 'COMPLETE';
  invoices: invoice[];
  bcds: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}
