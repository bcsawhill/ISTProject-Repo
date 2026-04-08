export function isAdvancedCredentialInfo(credential) {
    return 'type' in credential;
}
export var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["completed"] = "completed";
    MaintenanceStatus["none"] = "none";
    MaintenanceStatus["pending"] = "pending";
    MaintenanceStatus["preparing"] = "preparing";
    MaintenanceStatus["ready"] = "ready";
    MaintenanceStatus["running"] = "running";
})(MaintenanceStatus = MaintenanceStatus || (MaintenanceStatus = {}));
