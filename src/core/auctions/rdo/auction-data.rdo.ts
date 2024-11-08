export class AuctionDataRdo {
  customer: {
    name: string;
    id: number;
  };
  createdByCustomer: {
    name: string;
    id: number;
  };
  state: {
    name: string;
    id: number;
  };
  startDate: string;
  initialDuration: number;
  endDate: string;
  startCost: number;
  nextCost: number;
  lastBetSupplier: {
    name: string;
    id: number | null;
  };
  lastBetCost: number;
  lastBetId: number;
  lastBet: {
    num: number;
    cost: number;
    serverTime: string;
    isAutoBet: boolean;
    auctionId: number;
    supplierId: number;
    createUserId: number;
    lastManualServerTime: string | null;
    supplier: {
      name: string;
      id: number;
    };
    id: number;
  };
  step: number;
  auctionItem: Array<{
    currentValue: number;
    costPerUnit: number;
    okeiName: string;
    createdOfferId: number | null;
    skuId: number | null;
    imageId: number | null;
    defaultImageId: number | null;
    okpdName: string;
    productionDirectoryName: string;
    oksm: string | null;
    name: string | null;
    id: number;
  }>;
  bets: Array<{
    num: number;
    cost: number;
    serverTime: string;
    isAutoBet: boolean;
    auctionId: number;
    supplierId: number;
    createUserId: number;
    lastManualServerTime: string | null;
    supplier: {
      name: string;
      id: number | null;
    };
    id: number;
  }>;
  offerSignTime: string | null;
  uniqueSupplierCount: number;
  auctionRegion: Array<{
    treePathId: string;
    socr: string;
    id: number;
    oktmo: string;
    code: string;
    name: string;
  }>;
  repeatId: number | null;
  unpublishName: string;
  unpublishDate: string;
  federalLawName: string;
  conclusionReasonName: string;
  items: Array<{
    currentValue: number;
    costPerUnit: number;
    okeiName: string;
    createdOfferId: number | null;
    skuId: number;
    imageId: number;
    defaultImageId: number | null;
    okpdName: string;
    productionDirectoryName: string;
    oksm: string | null;
    name: string;
    id: number;
  }>;
  deliveries: Array<{
    periodDaysFrom: number;
    periodDaysTo: number;
    periodDateFrom: string | null;
    periodDateTo: string | null;
    deliveryPlace: string;
    quantity: number;
    items: Array<{
      sum: number;
      costPerUnit: number;
      quantity: number;
      name: string;
      buyerId: number | null;
      isBuyerInvitationSent: boolean;
      isApprovedByBuyer: boolean | null;
    }>;
    id: number;
  }>;
  files: Array<{
    companyId: number | null;
    name: string;
    id: number;
  }>;
  licenseFiles: Array<any>;
  offersSigned: boolean;
  showPurchaseRequestMessageIfFailed: boolean;
  purchaseTypeId: number;
  contractCost: number | null;
  contracts: Array<any>;
  unpublishComment: string | null;
  externalId: string;
  isElectronicContractExecutionRequired: boolean;
  isContractGuaranteeRequired: boolean;
  contractGuaranteeAmount: number | null;
  rowVersion: string;
  organizingTypeId: number;
  sharedPurchaseBuyers: any | null;
  suppliersAutobetSettings: Array<any>;
  isLicenseProduction: boolean;
  uploadLicenseDocumentsComment: string | null;
  isExternalIntegration: boolean;
  name: string;
  id: number;
}
