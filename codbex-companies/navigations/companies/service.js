const navigationData = {
    id: 'companies-navigation',
    label: "Companies",
    group: "company",
    order: 100,
    link: "/services/web/codbex-companies/gen/codbex-companies/ui/Companies/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }