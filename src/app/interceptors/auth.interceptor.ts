import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    req = req.clone({ setHeaders: { tsec: token } });
  }
  return next(req);
};
