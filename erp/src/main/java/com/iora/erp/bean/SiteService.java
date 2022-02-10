package com.iora.erp.bean;

import java.util.Collection;

import com.iora.erp.model.site.Site;

public interface SiteService {
    public abstract void createSite(Site site);

    public abstract Site getSite(Long id);

    public abstract Collection<Site> getAllSites();

    public abstract void updateSite(Site site);

    public abstract void deleteSite(Long id);
}
