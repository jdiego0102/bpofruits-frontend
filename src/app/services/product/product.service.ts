import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { map, catchError } from 'rxjs/operators';
import {
  ProducTypeResponse,
  Product,
  ProductResponse,
  ProducQualityResponse,
} from '../../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Obtener productos por tipo
  getProduct(productTypeId: number): Observable<ProductResponse | void> {
    return this.http
      .get<ProductResponse>(
        `${environment.API_URL}product/list/${productTypeId}`,
        {}
      )
      .pipe(
        map((res: ProductResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Obtener descripción del tipo producto
  getProductType(): Observable<ProducTypeResponse | void> {
    return this.http
      .get<ProducTypeResponse>(`${environment.API_URL}productType/list`, {})
      .pipe(
        map((res: ProducTypeResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Obtener calidad del producto
  getProductQuality(): Observable<ProducQualityResponse | void> {
    return this.http
      .get<ProducQualityResponse>(
        `${environment.API_URL}productQuality/list`,
        {}
      )
      .pipe(
        map((res: ProducQualityResponse) => {
          return res;
        }),
        // Capturar error
        catchError((err) => this.handlerError(err))
      );
  }

  // Controlar errores
  handlerError(err: any): Observable<never> {
    let errorValue = false;
    if (err) {
      errorValue = true;
    }
    return throwError(errorValue);
  }
}
