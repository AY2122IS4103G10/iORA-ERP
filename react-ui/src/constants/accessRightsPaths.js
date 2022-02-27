const accessRightsPaths = new Map();

accessRightsPaths.set("SYSADMIN_BASIC", 1);
accessRightsPaths.set("SYSADMIN_EMPLOYEE", 1);
accessRightsPaths.set("SYSADMIN_COMPANY", 1);
accessRightsPaths.set("MARKETING_BASIC", 0);
accessRightsPaths.set("MARKETING_MERCHANDISE", 0);
accessRightsPaths.set("MARKETING_PROCUREMENT", 0);
accessRightsPaths.set("MARKETING_CRM", 0);
accessRightsPaths.set("MANUFACTURING_BASIC", 2);
accessRightsPaths.set("WAREHOUSE_BASIC", 3);
accessRightsPaths.set("WAREHOUSE_ORDER", 3);
accessRightsPaths.set("STORE_BASIC", 4);
accessRightsPaths.set("STORE_INVENTORY", 4);

const accessRightsMap = (list) => {
    return [...new Set(list.map(x => accessRightsPaths.get(x)))];
}

export default accessRightsMap;