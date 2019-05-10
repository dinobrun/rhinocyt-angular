import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { Doctor, ModelList, Patient, CellCategory, CellExtraction, Cell } from '../interfaces/api-models';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it('should create API models', () => {
    const service: ApiService = TestBed.get(ApiService);

    expect(service.Doctor()).toBeTruthy();
    expect(service.Patient()).toBeTruthy();
    expect(service.Cell()).toBeTruthy();
    expect(service.CellExtraction()).toBeTruthy();
    expect(service.CellCategory()).toBeTruthy();
    expect(service.City()).toBeTruthy();
  });

  it('should retrieve correct URLs', () => {
    const service: ApiService = TestBed.get(ApiService);

    expect(service.Doctor().getApiUrl()).toBe(`${ApiService.BASE_API_URL}doctors/`);
    expect(service.Patient().getApiUrl()).toBe(`${ApiService.BASE_API_URL}patients/`);
    expect(service.Cell().getApiUrl()).toBe(`${ApiService.BASE_API_URL}cells/`);
    expect(service.CellExtraction().getApiUrl()).toBe(`${ApiService.BASE_API_URL}cell-extractions/`);
    expect(service.CellCategory().getApiUrl()).toBe(`${ApiService.BASE_API_URL}cell-categories/`);
    expect(service.City().getApiUrl()).toBe(`${ApiService.BASE_API_URL}cities/`);
  });

  it('should retrieve correctly', inject([HttpTestingController, ApiService], (httpMock: HttpTestingController, service: ApiService) => {
    // Doctor with id=1
    service.Doctor().get(1).subscribe((data: Doctor) => {
      expect(data.id).toBe(1);
      expect(data.username).toBe('doc_user');
      expect(data.email).toBe('');
      expect(data.first_name).toBe('Doc');
      expect(data.last_name).toBe('User');
      expect(data.patients.length).toBe(0);
    });

    let req = httpMock.expectOne(service.Doctor().getApiUrl(1));
    expect(req.request.method).toEqual('GET');
    req.flush({
      'id': 1,
      'username': 'doc_user',
      'email': '',
      'first_name': 'Doc',
      'last_name': 'User',
      'patients': []
    });

    // Patients
    service.Patient().all().subscribe((data: ModelList<Patient>) => {
      expect(data.count).toBe(2);
      expect(data.next).toBeNull();
      expect(data.previous).toBeNull();
      expect(data.results.length).toBe(2);
    });

    req = httpMock.expectOne(service.Patient().getApiUrl());
    expect(req.request.method).toEqual('GET');
    req.flush({
      'count': 2,
      'next': null,
      'previous': null,
      'results': [
        {
          'id': 1,
          'first_name': 'User',
          'last_name': 'Pat',
          'fiscal_code': '1234567890123456',
          'birthdate': '1983-02-02',
          'created': '2018-12-16T17:27:09.313762Z',
          'residence_city': null,
          'birth_city': null,
          'doctor': 1
        },
        {
          'id': 2,
          'first_name': 'Michele',
          'last_name': 'Giorgio',
          'fiscal_code': '1234567890123456',
          'birthdate': null,
          'created': '2018-12-16T17:28:04.644230Z',
          'residence_city': null,
          'birth_city': null,
          'doctor': 2
        }
      ]
    });

    // Patient with id=1
    service.Patient().get(1).subscribe((data: Patient) => {
        expect(data.id).toBe(1);
        expect(data.first_name).toBe('User');
        expect(data.last_name).toBe('Pat');
        expect(data.fiscal_code).toBe('1234567890123456');
        expect(data.birthdate).toBe('1983-02-02');
        expect(data.created).toBe('2018-12-16T17:27:09.313762Z');
        expect(data.residence_city).toBeNull();
        expect(data.birth_city).toBeNull();
        expect(data.doctor).toBe(1);
      });

    req = httpMock.expectOne(service.Patient().getApiUrl(1));
    expect(req.request.method).toEqual('GET');
    req.flush({
      'id': 1,
      'first_name': 'User',
      'last_name': 'Pat',
      'fiscal_code': '1234567890123456',
      'birthdate': '1983-02-02',
      'created': '2018-12-16T17:27:09.313762Z',
      'residence_city': null,
      'birth_city': null,
      'doctor': 1
    });

    // Cell categories
    service.CellCategory().all().subscribe((data: ModelList<CellCategory>) => {
      expect(data.count).toBe(7);
      expect(data.next).toBeNull();
      expect(data.previous).toBeNull();
      expect(data.results.length).toBe(data.count);

      expect(data.results[0].id).toBe(1);
      expect(data.results[0].classnum).toBe(0);
      expect(data.results[0].name).toBe('epithelium');

      expect(data.results[1].id).toBe(2);
      expect(data.results[1].classnum).toBe(1);
      expect(data.results[1].name).toBe('neutrophil');

      expect(data.results[2].id).toBe(3);
      expect(data.results[2].classnum).toBe(2);
      expect(data.results[2].name).toBe('eosinophil');

      expect(data.results[3].id).toBe(4);
      expect(data.results[3].classnum).toBe(3);
      expect(data.results[3].name).toBe('mastocyte');

      expect(data.results[4].id).toBe(5);
      expect(data.results[4].classnum).toBe(4);
      expect(data.results[4].name).toBe('lymphocyte');

      expect(data.results[5].id).toBe(6);
      expect(data.results[5].classnum).toBe(5);
      expect(data.results[5].name).toBe('mucipara');

      expect(data.results[6].id).toBe(7);
      expect(data.results[6].classnum).toBe(6);
      expect(data.results[6].name).toBe('other');
    });

    req = httpMock.expectOne(service.CellCategory().getApiUrl());
    expect(req.request.method).toEqual('GET');
    req.flush({
      'count': 7,
      'next': null,
      'previous': null,
      'results': [
          {'id': 1, 'classnum': 0, 'name': 'epithelium'},
          {'id': 2, 'classnum': 1, 'name': 'neutrophil'},
          {'id': 3, 'classnum': 2, 'name': 'eosinophil'},
          {'id': 4, 'classnum': 3, 'name': 'mastocyte'},
          {'id': 5, 'classnum': 4, 'name': 'lymphocyte'},
          {'id': 6, 'classnum': 5, 'name': 'mucipara'},
          {'id': 7, 'classnum': 6, 'name': 'other'}
      ]
    });

    // Cell extractions
    service.CellExtraction().all().subscribe((data: ModelList<CellExtraction>) => {
      expect(data.count).toBe(1)
      expect(data.next).toBeNull();
      expect(data.previous).toBeNull();
      expect(data.results.length).toBe(1);
    });

    req = httpMock.expectOne(service.CellExtraction().getApiUrl());
    expect(req.request.method).toEqual('GET');
    req.flush({
      'count': 1,
      'next': null,
      'previous': null,
      'results': [
        {
          'id': 1,
          'cells': [],
          'datetime': '2018-12-19T09:49:53.261186Z'
        }
      ]
    });

    // Cell extraction with id=1
    service.CellExtraction().get(1).subscribe((data: CellExtraction) => {
      expect(data.id).toBe(1)
      expect(data.datetime).toBe('2018-12-19T09:49:53.261186Z');
      expect(data.cells.length).toBe(1);
    });

    req = httpMock.expectOne(service.CellExtraction().getApiUrl(1));
    expect(req.request.method).toEqual('GET');
    req.flush({
      'id': 1,
      'cells': [
        {
          'id': 1,
          'image': 'media/cells/img0_cell0_TalhQnn.png',
          'validated': false,
          'patient': 2,
          'cell_extraction': 1,
          'cell_category': 1
        }
      ],
      'datetime': '2018-12-19T09:49:53.261186Z'
    });

    // Cells
    service.Cell().all().subscribe((data: ModelList<Cell>) => {
      expect(data.count).toBe(1)
      expect(data.next).toBeNull();
      expect(data.previous).toBeNull();
      expect(data.results.length).toBe(1)
    });

    req = httpMock.expectOne(service.Cell().getApiUrl());
    expect(req.request.method).toEqual('GET');
    req.flush({
      'count': 1,
      'next': null,
      'previous': null,
      'results': [
        {
          'id': 1,
          'image': 'http://mlapolla1.pythonanywhere.com/media/cells/img0_cell0_TalhQnn.png',
          'validated': false,
          'patient': 2,
          'cell_extraction': 1,
          'cell_category': 1
        }
      ]
    });

    // Cell with id=1
    service.Cell().get(1).subscribe((data: Cell) => {
      expect(data.id).toBe(1)
      expect(data.image).toBe('/media/cells/img0_cell0_TalhQnn.png');
      expect(data.validated).toBeFalsy();
      expect(data.patient).toBe(2)
      expect(data.cell_extraction).toBe(1)
      expect(data.cell_category).toBe(1)
    });

    req = httpMock.expectOne(service.Cell().getApiUrl(1));
    expect(req.request.method).toEqual('GET');
    req.flush({
      'id': 1,
      'image': '/media/cells/img0_cell0_TalhQnn.png',
      'validated': false,
      'patient': 2,
      'cell_extraction': 1,
      'cell_category': 1
    });
  }));
});
