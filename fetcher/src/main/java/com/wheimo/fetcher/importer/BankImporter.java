package com.wheimo.fetcher.importer;

import com.wheimo.fetcher.dto.SyncResultMessage;
import com.wheimo.fetcher.dto.SyncRequestMessage;

public interface BankImporter {
    SyncResultMessage fetchTransactions(SyncRequestMessage request, String decryptedPassword);
}
