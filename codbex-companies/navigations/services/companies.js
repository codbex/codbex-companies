const navigationData = {
    id: 'companies-navigation',
    label: "Companies",
    view: "companies",
    group: "configurations",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-companies/gen/codbex-companies/ui/Companies/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }