package gen.codbex_companies.data.companies;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CompanyRepository extends JavaRepository<CompanyEntity> {

    public CompanyRepository() {
        super(CompanyEntity.class);
    }
}
