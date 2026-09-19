import { Scheme } from '../types';
import { AGRICULTURE_SCHEMES } from './schemes/agriculture.js';
import { HEALTHCARE_SOCIAL_SCHEMES } from './schemes/healthcareSocial.js';
import { EMPLOYMENT_SKILLS_SCHEMES } from './schemes/employmentSkills.js';
import { WOMEN_CHILD_EDUCATION_SCHEMES } from './schemes/womenChildEducation.js';
import { STATE_ENERGY_HOUSING_SCHEMES } from './schemes/stateEnergyHousing.js';

export const SEED_SCHEMES: Scheme[] = [
  ...AGRICULTURE_SCHEMES,
  ...HEALTHCARE_SOCIAL_SCHEMES,
  ...EMPLOYMENT_SKILLS_SCHEMES,
  ...WOMEN_CHILD_EDUCATION_SCHEMES,
  ...STATE_ENERGY_HOUSING_SCHEMES
];

export const TOTAL_SCHEMES_COUNT = SEED_SCHEMES.length;
