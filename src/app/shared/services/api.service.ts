import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, catchError, mergeMap, concatMap } from 'rxjs/operators';

import { cloneDeep } from 'lodash';

import { AuthService, SignupEvent, LoginEvent } from './auth.service';
import {
  Doctor,
  Patient,
  Cell,
  CellExtraction,
  CellCategory,
  Slide,
  City,
  Anamnesis,
  PrickTest,
  Allergy,
  Report,
  ApiModel,
  DiagnosisExtraction,
  ModelList
} from '../interfaces/api-models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * The base URL for the API.
   */
  private static readonly BASE_API_URL: string = 'http://127.0.0.1:8000/api/';


  /**
   * The state of debug of the service.
   */
  private debug = false;

  /**
   * The generic HTTP options of the service.
   */
  private httpOptions = {
    headers: new HttpHeaders()
  };

  /**
   * Models for retrieving the data.
   */
  private doctor: DoctorApiHelper;
  private patient: PatientApiHelper;
  private cell: CellApiHelper;
  private cellExtraction: CellExtractionApiHelper;
  private cellCategory: CellCategoryApiHelper;
  private slide: SlideApiHelper;
  private city: CityApiHelper;
  private anamnesis: AnamnesisApiHelper;
  private prickTest: PrickTestApiHelper;
  private allergy: AllergyApiHelper;
  private diagnosisExtraction: DiagnosisExtractionApiHelper;
  private report: ReportApiHelper;


  constructor(private http: HttpClient, private authService: AuthService) {
    if (isDevMode()) {
      // show info in dev mode
      console.log(`API service attached on "${ApiService.BASE_API_URL}".`);
    }

    let headers: HttpHeaders = this.httpOptions.headers;

    if (this.authService.isLogged()) {
      headers = headers.set('Authorization', `Token ${this.authService.getToken()}`);
    }

    this.httpOptions.headers = headers;


    this.authService.onLogin().subscribe((event) => {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Token ${this.authService.getToken()}`);
    });

    this.authService.onLogout().subscribe((event) => {
      this.httpOptions.headers = this.httpOptions.headers.delete('Authorization');
    });


    // Creating the API helpers
    this.doctor              = new DoctorApiHelper(this);
    this.patient             = new PatientApiHelper(this);
    this.cell                = new CellApiHelper(this);
    this.cellExtraction      = new CellExtractionApiHelper(this);
    this.cellCategory        = new CellCategoryApiHelper(this);
    this.slide               = new SlideApiHelper(this);
    this.city                = new CityApiHelper(this);
    this.anamnesis           = new AnamnesisApiHelper(this);
    this.prickTest           = new PrickTestApiHelper(this);
    this.allergy             = new AllergyApiHelper(this);
    this.diagnosisExtraction = new DiagnosisExtractionApiHelper(this);
    this.report              = new ReportApiHelper(this);
  }

  /**
   * Returns the HttpClient object.
   */
  public getHttp(): HttpClient {
    return this.http;
  }

  /**
   * Reeturns the AuthService object.
   */
  public getAuthService(): AuthService {
    return this.authService;
  }

  /**
   * Returns the HTTP options for a given request type.
   * @param method The request method.
   */
  public getHttpOptions(method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', init?: {params?: HttpParams, reportProgress?: boolean}) {
    return {
      ...this.httpOptions,
      ...init
    };
  }

  /**
   * Returns the base API URL.
   */
  public getBaseApiUrl(): string {
    return ApiService.BASE_API_URL;
  }

  /**
   * Returns the doctor's API helper.
   */
  public Doctor(): DoctorApiHelper {
    return this.doctor;
  }

  /**
   * Returns the patient's API helper.
   */
  public Patient(): PatientApiHelper {
    return this.patient;
  }

  /**
   * Returns the cell's API helper.
   */
  public Cell(): CellApiHelper {
    return this.cell;
  }

  /**
   * Returns the cell extraction's API helper.
   */
  public CellExtraction(): CellExtractionApiHelper {
    return this.cellExtraction;
  }

  /**
   * Returns the cell category's API helper.
   */
  public CellCategory(): CellCategoryApiHelper {
    return this.cellCategory;
  }

  /**
   * Returns the slide's API helper.
   */
  public Slide(): SlideApiHelper {
    return this.slide;
  }

  /**
   * Returns the city's model API.
   */
  public City(): CityApiHelper {
    return this.city;
  }

  /**
   * Returns the anamnesis's model API.
   */
  public Anamnesis(): AnamnesisApiHelper {
    return this.anamnesis;
  }

  /**
   * Returns the prick test's model API.
   */
  public PrickTest(): PrickTestApiHelper {
    return this.prickTest;
  }

  /**
   * Returns the allergy's model API.
   */
  public Allergy(): AllergyApiHelper {
    return this.allergy;
  }

  /**
   * Returns the diagnosis extraction's model API.
   */
  public DiagnosisExtraction(): DiagnosisExtractionApiHelper {
    return this.diagnosisExtraction;
  }

  /**
   * Returns the report's API helper.
   */
  public Report(): ReportApiHelper {
    return this.report;
  }

}


/**
 * Generic API helper for the models.
 */
abstract class ApiHelper {

  protected http: HttpClient;

  constructor(protected apiService: ApiService) {
    this.http = apiService.getHttp();
  }

  protected pathJoin(...paths: string[]): string {
    return paths.map((path: string) => path.replace(/(^\/+|\/+$)/, ''))
                .filter(path => path !== '')
                .join('/');
  }

  /**
   * Join a given list of paths.
   * @param paths The paths to join.
   */
  protected getJsonUrl(...paths: string[]): string {
    const extension = '/';
    return this.apiService.getBaseApiUrl() + this.pathJoin(...paths) + extension;
  }

  /**
   * Returns the API path for the specific helper.
   */
  public abstract getApiPath(): string;

  /**
   * Returns the API URL for the specific helper.
   * @param id The instance's id.
   * @returns  The API URL.
   */
  public getApiUrl(id?: number, operation?: string): string {
    return this.getJsonUrl(this.getApiPath(), String(!isNaN(id) ? id : ''), operation ? operation : '');
  }

  public getApiTokenAuthUrl(): string {
    return this.pathJoin(this.apiService.getBaseApiUrl(), 'token-auth') + '/';
  }

  /**
   * Handles the error for a given operation and a given result.
   * @param operation The operation name.
   * @param result    The result's type.
   * @returns         The observable function.
   */
  protected handleError<K>(operation: string, result?: K) {
    return (error): Observable<K> => {
      if (isDevMode()) {
        console.error(`Error on operation "${operation}".`, error);
      }

      return of(result as K);
    };
  }
}

/**
 * The read-only API helper.
 */
abstract class ReadOnlyApiHelper<T extends ApiModel> extends ApiHelper {
  /**
   * Handles a GET request.
   * @param url       The URL for the GET request.
   * @param operation The operation name (e.g., 'all').
   * @param params    The params of the request.
   * @returns         The observable object.
   */
  protected handleGetRequest<K>(url: string, operation: string,
                                init?: {params?: HttpParams, reportProgress?: boolean}): Observable<K> {
    const httpOptions = this.apiService.getHttpOptions('GET', init);

    return this.http.get<K>(url, httpOptions);
      // .pipe(catchError(this.handleError<K>(operation)));
  }

  /**
   * Returns all the model objects.
   * @returns The observable object.
   */
  public all(): Observable<ModelList<T>> {
    const url = this.getApiUrl();
    return this.handleGetRequest(url, 'all');
  }

  /**
   * Returns a specific model object.
   * @param id The id of the object.
   */
  public get(id: number): Observable<T> {
    const url = this.getApiUrl(id);
    return this.handleGetRequest(url, 'get');
  }

  public query(params: HttpParams): Observable<T | T[]> {
    const url = this.getApiUrl();
    return this.handleGetRequest(url, 'query', {params: params});
  }
}


/**
 * The writable API helper.
 */
abstract class WritableApiHelper<T extends ApiModel> extends ReadOnlyApiHelper<T> {
  /**
   * Converts given data in a FormData object.
   * @param data The data to convert.
   */
  protected convertToFormData<K>(requestType: 'GET' | 'POST' | 'PUT' | 'PATCH', data: K): FormData {
    if (isDevMode()) {
      console.log(`${requestType} data:`, data);
    }

    const fd: FormData = new FormData();

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        const value = data[prop];

        if (value instanceof File) {
          fd.append(prop, value, value.name);
        } else if (value instanceof Object) {
          fd.append(prop, JSON.stringify(value));
        } else if (value === null) {
          fd.append(prop, '');
        } else if (value !== undefined) {
          fd.append(prop, String(value));
        }
      }
    }

    return fd;
  }

  /**
   * Handles a POST request.
   * @param url       The URL of the request.
   * @param data      The data to send.
   * @param operation The operation name.
   * @param init      The initializers for HTTP options.
   * @returns         The observable object.
   */
  protected handlePostRequest<K>(url: string, data: any, operation: string,
                                 init?: {params?: HttpParams, reportProgress?: boolean}): Observable<K> {
    const httpOptions = this.apiService.getHttpOptions('POST', init);
    const fd = this.convertToFormData('POST', data);

    return this.http.post<K>(url, fd, httpOptions)
      // .pipe(catchError(this.handleError<K>(operation)));
  }

  /**
   * Handles a PUT request.
   * @param url       The URL of the request.
   * @param data      The data to send.
   * @param operation The operation name.
   * @param init      The initializers for HTTP options.
   * @returns         The observable object.
   */
  protected handlePutRequest<K>(url: string, data: any, operation: string,
                                init?: {params?: HttpParams, reportProgress?: boolean}): Observable<K> {
    const httpOptions = this.apiService.getHttpOptions('PUT', init);
    const fd: FormData = this.convertToFormData('PUT', data);

    return this.http.put<K>(url, fd, httpOptions);
      // .pipe(catchError(this.handleError<K>(operation)));
  }

  /**
   * Handles a PATCH request.
   * @param url       The URL of the request.
   * @param data      The data to send.
   * @param operation The operation name.
   * @param init      The initializers for HTTP options.
   * @returns         The observable object.
   */
  protected handlePatchRequest<K>(url: string, data: any, operation: string,
                                  init?: {params?: HttpParams, reportProgress?: boolean}): Observable<K> {
    const httpOptions = this.apiService.getHttpOptions('PATCH', init);
    const fd: FormData = this.convertToFormData('PATCH', data);

    return this.http.patch<K>(url, fd, httpOptions);
      // .pipe(catchError(this.handleError<K>(operation)));
  }

  /**
   * Handles a DELETE request.
   * @param url       The URL of the request.
   * @param data      The data to send.
   * @param operation The operation name.
   * @param init      The initializers for HTTP options.
   * @returns         The observable object.
   */
  protected handleDeleteRequest<K>(url: string, operation: string,
                                   init?: {params?: HttpParams, reportProgress?: boolean}): Observable<K> {
    const httpOptions = this.apiService.getHttpOptions('DELETE', init);

    return this.http.delete<K>(url, httpOptions);
      // .pipe(catchError(this.handleError<K>(operation)));
  }

  /**
   * Creates a new model from a given data.
   * @param data The data to create the new model.
   */
  public create(model: T): Observable<T> {
    if (model.id !== undefined) {
      throw new Error('Passed id for creating a new model.');
    }

    const url = this.getApiUrl();
    return this.handlePostRequest(url, model, 'create');
  }

  /**
   * Updates a model.
   * @param model The data of the model to update.
   */
  public update(model: T): Observable<T> {
    if (model.id === undefined) {
      throw new Error('The update() method requires the model\'s id.');
    }

    if (isNaN(model.id)) {
      throw new Error(`The model's id must be a number, instead is: ${typeof model.id}.`);
    }

    const url = this.getApiUrl(model.id);
    delete model.id;

    return this.handlePatchRequest(url, model, 'update');
  }

  /**
   * Replaces a model with a new one.
   * @param model The new model.
   */
  public replace(model: T): Observable<T> {
    if (model.id === undefined) {
      throw new Error('The replace() method requires the model\'s id.');
    }

    if (!isNaN(model.id)) {
      throw new Error(`The model's id must be a number, instead is: ${typeof model.id}.`);
    }

    const url = this.getApiUrl(model.id);
    return this.handlePostRequest(url, model, 'replace');
  }

  /**
   * Deletes a model.
   * @param id The id of the model
   */
  public delete(id: number) {
    const url = this.getApiUrl(id);
    return this.handleDeleteRequest(url, 'delete');
  }
}


/**
 * The doctor's API helper.
 */
class DoctorApiHelper extends WritableApiHelper<Doctor> {
  public getApiPath(): string {
    return 'doctors/';
  }

  public login(username: string, password: string): Observable<{doctor: Doctor, token: string}> {
    const url = this.getApiTokenAuthUrl();
    const data = {
      username: username,
      password: password
    };

    return this.handlePostRequest(url, data, 'login')
               .pipe(mergeMap((requestData: {token: string}) => {
                 let params = new HttpParams();
                 params = params.set('token', requestData.token);
                 return this.query(params)
                            .pipe(map((doctor: Doctor) => {
                              return {
                                doctor: doctor,
                                token: requestData.token
                              };
                            }));
               }))
              .pipe(tap((loginData: {doctor: Doctor, token: string}) => this.apiService.getAuthService().login(loginData)));
  }

  public signup(data: any): Observable<{doctor: Doctor, token: string}> {
    const url = this.getApiUrl();
    return this.handlePostRequest(url, data, 'signup')
               .pipe(mergeMap((doctor: Doctor) => {
                 console.log(`Loggin-in as "${data.username}" with "${data.password}".`);
                 return this.login(data.username, data.password);
               }));
  }
}


/**
 * The patient's API helper.
 */
class PatientApiHelper extends WritableApiHelper<Patient> {
  public getApiPath(): string {
    return 'patients/';
  }
}


/**
 * The cell's API helper.
 */
class CellApiHelper extends WritableApiHelper<Cell> {
  public getApiPath(): string {
    return 'cells/';
  }
}


/**
 * The cell extraction's API helper.
 */
class CellExtractionApiHelper extends WritableApiHelper<CellExtraction> {

  public getApiPath(): string {
    return 'cell-extractions/';
  }

  public create(data: any): Observable<CellExtraction> {
    const slides = data.slides;

    if (!Array.isArray(slides)) {
      throw new Error('Slides required to be an array.');
    }

    if (slides.length === 0) {
      throw new Error('A cell extraction must have at least one slide.');
    }

    const url = this.getApiUrl();
    let request: Observable<Object> = this.handlePostRequest<CellExtraction>(url, {patient: data.patient}, 'create');

    //remove the first element from array of slides
    const slide = slides.shift();

    //pipe the first slide creation to the request picking the id from cellExtraction
    request = request.pipe(mergeMap((cellExtraction: CellExtraction, index) => {
      slide.cell_extraction = cellExtraction.id;
      return this.apiService.Slide().create(slide);
    }));

    //loop over all slides and pipe the creation request
    for (const slide of slides) {
      request = request.pipe(mergeMap((slideData: Slide, index) => {
        slide.cell_extraction = slideData.cell_extraction_id;
        return this.apiService.Slide().create(slide);
      }));
    }

    request = request.pipe(concatMap((slideData: Slide, index) => {
      return this.get(slideData.cell_extraction_id);
    }));

    return <Observable<CellExtraction>>request;
  }

  public last(patient_id: number): Observable<CellExtraction> {
    const url = this.getApiUrl(undefined, 'last');
    let params: HttpParams = new HttpParams();
    if (!isNaN(patient_id)) {
      params = params.set('patient', String(patient_id));
    }
    return this.handleGetRequest(url, 'last', {params: params});
  }
}


/**
 * The cell category's API helper.
 */
class CellCategoryApiHelper extends ReadOnlyApiHelper<CellCategory> {
  public getApiPath(): string {
    return 'cell-categories/';
  }
}

/**
 * The cell category's API helper.
 */
class AllergyApiHelper extends ReadOnlyApiHelper<Allergy> {
  public getApiPath(): string {
    return 'allergy/';
  }
}


/**
 * The slide's API helper.
 */
class SlideApiHelper extends WritableApiHelper<Slide> {
  public getApiPath(): string {
    return 'slides/';
  }
}


/**
 * The city's API helper.
 */
class CityApiHelper extends ReadOnlyApiHelper<City> {
  public getApiPath(): string {
    return 'cities/';
  }
}

/**
 * The anamnesis API helper
 */
 class AnamnesisApiHelper extends WritableApiHelper<Anamnesis>{
   public getApiPath(): string {
     return 'anamnesis/';
   }

   public create(data: any): Observable<Anamnesis> {
     const allergyList = data.allergyList;
     const anamnesis = data.anamnesis;
     let prickTest: PrickTest = {};

     const url = this.getApiUrl();
     let request: Observable<Object> = this.handlePostRequest<Anamnesis>(url, anamnesis, 'create');


     if (allergyList.length > 0){
       //there are Allergies
       //remove the first element from array of slides
       const allergy = allergyList.shift();
       //pipe the first slide creation to the request picking the id from cellExtraction
       request = request.pipe(mergeMap((anamnesis: Anamnesis, index) => {
         prickTest.anamnesis = anamnesis.id;
         prickTest.allergy = allergy.id;
         return this.apiService.PrickTest().create(prickTest);
       }));

       //loop over allergies array
       for (const allergy of allergyList){
         request = request.pipe(mergeMap((prickTestData: PrickTest, index) => {
           prickTest.anamnesis = prickTestData.anamnesis;
           prickTest.allergy = allergy.id;
           return this.apiService.PrickTest().create(prickTest);
         }));
       }
      }
     return <Observable<Anamnesis>>request;
   }

   //get last anamnesis
   public last(patient_id: number): Observable<Anamnesis> {
     const url = this.getApiUrl(undefined, 'last');
     let params: HttpParams = new HttpParams();
     if (!isNaN(patient_id)) {
       params = params.set('patient', String(patient_id));
     }
     return this.handleGetRequest(url, 'last', {params: params});
   }



 }

 /**
  * The prick-test API helper
  */
  class PrickTestApiHelper extends WritableApiHelper<PrickTest>{
  public getApiPath(): string {
    return 'prick-test/';
    }
  }

  /**
   * The DiagnosisExtraction API helper
   */
   class DiagnosisExtractionApiHelper extends WritableApiHelper<PrickTest>{
   public getApiPath(): string {
     return 'diagnosis-extractions/';
     }
   }

   /**
    * The report API helper
    */
    class ReportApiHelper extends WritableApiHelper<Report>{
    public getApiPath(): string {
      return 'report/';
      }
    }
