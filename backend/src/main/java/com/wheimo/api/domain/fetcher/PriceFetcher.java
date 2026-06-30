package com.wheimo.api.domain.fetcher;

import com.wheimo.api.domain.entity.PriceReading;
import com.wheimo.api.domain.entity.PriceTracker;

import java.util.List;
import java.util.Map;

public interface PriceFetcher {
    String getType();
    List<PriceReading> fetch(PriceTracker tracker);
    Map<String, Object> getParamSchema();
}
