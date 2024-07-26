import { CompanyRepository } from "codbex-companies/gen/codbex-companies/dao/Companies/CompanyRepository";
import { CityRepository } from "codbex-cities/gen/codbex-cities/dao/Cities/CityRepository";

export const trigger = (event) => {
    const CompanyDao = new CompanyRepository();
    const CityDao = new CityRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {

        const companies = CompanyDao.findAll({
            $filter: {
                equals: {
                    Id: item.Id
                }
            }
        });

        const cities = CityDao.findAll({
            $filter: {
                equals: {
                    Id: item.City
                }
            }
        });

        companies[0].Country = cities[0].Country;

        CompanyDao.update(companies[0]);

    }

}