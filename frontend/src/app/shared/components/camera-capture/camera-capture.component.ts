import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [ButtonModule, TranslocoModule],
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.scss',
})
export class CameraCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fallbackInput') fallbackInputRef!: ElementRef<HTMLInputElement>;

  readonly photoCaptured = output<File>();
  readonly cancelled = output<void>();

  capturedUrl = signal<string | null>(null);
  readonly useGetUserMedia = signal(false);

  private stream: MediaStream | null = null;
  private capturedBlob: Blob | null = null;

  async ngOnInit(): Promise<void> {
    this.useGetUserMedia.set(
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    );
    if (this.useGetUserMedia()) {
      await this.startCamera();
    }
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      const video = this.videoRef?.nativeElement;
      if (video) {
        video.srcObject = this.stream;
      }
    } catch {
      this.useGetUserMedia.set(false);
    }
  }

  capture(): void {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    this.stopStream();
    canvas.toBlob(
      (blob) => {
        if (blob) {
          this.capturedBlob = blob;
          const url = URL.createObjectURL(blob);
          this.capturedUrl.set(url);
        }
      },
      'image/jpeg',
      0.92
    );
  }

  retake(): void {
    const url = this.capturedUrl();
    if (url) URL.revokeObjectURL(url);
    this.capturedUrl.set(null);
    this.capturedBlob = null;
    this.startCamera();
  }

  usePhoto(): void {
    if (!this.capturedBlob) return;
    const file = new File([this.capturedBlob], `photo-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    this.photoCaptured.emit(file);
    this.cleanup();
  }

  openFallback(): void {
    this.fallbackInputRef.nativeElement.click();
  }

  onFallbackSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.photoCaptured.emit(file);
      this.cleanup();
    }
  }

  cancel(): void {
    this.cleanup();
    this.cancelled.emit();
  }

  private stopStream(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  private cleanup(): void {
    this.stopStream();
    const url = this.capturedUrl();
    if (url) URL.revokeObjectURL(url);
    this.capturedUrl.set(null);
    this.capturedBlob = null;
  }
}
