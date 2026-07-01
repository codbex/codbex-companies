package gen.codbex_companies.data.companies;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class CompanyRepository extends JavaRepository<CompanyEntity> {

    public CompanyRepository() {
        super(CompanyEntity.class);
    }

    @Override
    public CompanyEntity save(CompanyEntity entity) {
        CompanyEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-companies-Companies-Company", Json.stringify(saved));
        return saved;
    }

    @Override
    public CompanyEntity update(CompanyEntity entity) {
        CompanyEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-companies-Companies-Company-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Company-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CompanyEntity updateWithoutEvent(CompanyEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CompanyEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-companies-Companies-Company-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CompanyEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-companies-Companies-Company-deleted", Json.stringify(entity));
        }
    }
}
