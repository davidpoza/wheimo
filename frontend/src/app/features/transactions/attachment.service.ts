import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachment } from '../../core/models/attachment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/attachments`;

  upload(transactionId: number, file: File): Observable<Attachment> {
    const form = new FormData();
    form.append('transactionId', String(transactionId));
    form.append('file', file);
    return this.http.post<Attachment>(this.baseUrl, form);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}`, { responseType: 'blob' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
