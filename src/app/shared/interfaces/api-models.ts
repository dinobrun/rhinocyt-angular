/**
 * API model, with id as a primary key. This model represents the vast majority
 * of models.
 */
export interface ApiModel {
  id?: number;
}


/**
 * Generic interface for the model's list.
 */
export interface ModelList<T extends ApiModel> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

/**
 * The interface for the doctor's model.
 */
export interface Doctor extends ApiModel {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  patients?: Patient[];
}

/**
 * The interface for the patient's model.
 */
export interface Patient extends ApiModel {
  first_name?: string;
  last_name?: string;
  fiscal_code?: string;
  birthdate?: string;
  created?: string;
  residence_city?: string;
  birth_city?: string;
  doctor?: number;
}

/**
 * Interface for the cell's model.
 */
export interface Cell extends ApiModel {
  image?: string | File;
  validated?: boolean;
  patient?: number;
  cell_extraction?: number;
  cell_category?: number;
}

/**
 * The interface for the cell category's model.
 */
export interface CellCategory extends ApiModel {
  classnum: number;
  name: string;
}

/**
 * The interface for the cell extraction's model.
 */
export interface CellExtraction extends ApiModel {
  slides: Slide[];
  extraction_date?: string;
  epithelium_num?: number;
  neutrophil_num?: number;
  eosinophil_num?: number;
  mastocyte_num?: number;
  lymphocyte_num?: number;
  mucipara_num?: number;
}

/**
 * Interface for the slide's model.
 */
export interface Slide extends ApiModel {
  image?: string | File;
  cell_extraction_id?: number;
  patient_id?: number;
  cells?: Cell[];
}

/**
 * Interface for the city's model.
 */
export interface City extends ApiModel {
  code: string;
  name: string;
  province_code: string;
}

/**
 * Interface for the anamnesis's model.
 */
export interface Anamnesis extends ApiModel {
  //anamnesi familiare
  allergy_gen?: string;
  allergy_fra?: string;
  polip_nas_gen?: boolean;
  polip_nas_fra?: boolean;
  asma_bronch_gen?: boolean;
  asma_bronch_fra?: boolean;
  //sintomatologia
  ostr_nas?: string;
  rinorrea?: string;
  rinorrea_espans?: string;
  prur_nas?: boolean;
  starnutazione?: string;
  prob_olf?: string;
  ovatt_aur?: string;
  ipoacusia?: string;
  acufeni?: string;
  sindr_ver?: string;
  febbre?: boolean;
  uso_farmaci?: boolean;
  lacrimazione?: boolean;
  fotofobia?: boolean;
  prurito_cong?: boolean;
  bruciore_cong?: boolean;
  //esame medico
  pir_nas?: string;
  valv_nas?: string;
  setto_nas?: string;
  turb?: string;
  polip_nas_sx?: number;
  polip_nas_dx?: number;
  essudato?: string;
  ipertr_adenoidea?: number;
  patient?: number;
  anamnesis_date?: string;
  conclusioni_esame?: string;
  appunti_alter_rinofaringe?: string;
  appunti_sintom?: string;
  appunti_anam_fam?: string;
  esame_orecchie?: string;
  prick_test?: PrickTest[];
}

/**
 * Interface for the prick test's model.
 */
export interface PrickTest extends ApiModel {
  allergy?: number;
  period?: string;
  anamnesis?: number;
}

/**
 * Interface for the prick test's model.
 */
export interface Allergy extends ApiModel {
  type?: string;
  value?: boolean;
}

/**
 * Interface for the diagnosis extraction's model.
 */
export interface DiagnosisExtraction extends ApiModel {
  patient?: number;
  cell_extraction?: number;
  anamnesis?: number;
}

/**
 * Interface for the diagnosis's model.
 */
export interface Diagnosis extends ApiModel {
  diagnosis_extraction?: number;
  name?: number;
  information?: number;
}

/**
 * Interface for the report's model.
 */
export interface Report extends ApiModel {
  cell_extraction?: number;
  anamnesis?: number;
  report_file?: string;
}
