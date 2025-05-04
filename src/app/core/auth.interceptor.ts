// auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn =
  (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {


    const url = new URL(req.url, window.location.origin);   // safe even for absolute URLs
    const pathname = url.pathname;                          // → "/api/v1/auth/activate-account"
  
    const isPublic =
        pathname.startsWith('/api/v1/auth/')
  if (isPublic) {
    // ⇢ 2 – pass the request through untouched
    return next(req);
  }
    const token = localStorage.getItem('access_token');
    return next(
      token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req
    );
  };
