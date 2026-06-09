package gen.codbex_companies.data.companies;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_COMPANY")
@Documentation("Company entity mapping")
public class CompanyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPANY_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "COMPANY_NAME", length = 100, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "COMPANY_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "COMPANY_MANAGER", nullable = false)
    @Documentation("Manager")
    public Integer Manager;

    @Column(name = "COMPANY_PHONE", length = 20, nullable = true)
    @Documentation("Phone")
    public String Phone;

    @Column(name = "COMPANY_ADDRESS", length = 200, nullable = false)
    @Documentation("Address")
    public String Address;

    @Column(name = "COMPANY_COUNTRY", nullable = false)
    @Documentation("Country")
    public Integer Country;

    @Column(name = "COMPANY_CITY", nullable = false)
    @Documentation("City")
    public Integer City;

    @Column(name = "COMPANY_POSTCODE", length = 20, nullable = false)
    @Documentation("PostCode")
    public String PostCode;

    @Column(name = "COMPANY_TIN", length = 20, nullable = true)
    @Documentation("TIN")
    public String TIN;

    @Column(name = "COMPANY_IBAN", length = 34, nullable = false, unique = true)
    @Documentation("IBAN")
    public String IBAN;

    @CreatedAt
    @Column(name = "COMPANY_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "COMPANY_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "COMPANY_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "COMPANY_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
