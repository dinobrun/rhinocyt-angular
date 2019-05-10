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
