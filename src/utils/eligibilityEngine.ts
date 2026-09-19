import { Scheme, UserProfile, EligibilityResult } from '../types';

/**
 * Deterministic Rule-Based Eligibility Engine.
 * Does NOT use probabilistic or AI hallucinations.
 * Compares structured profile fields against structured scheme constraints.
 */
export function evaluateEligibility(
  profile: Partial<UserProfile> | null | undefined,
  scheme: Scheme
): EligibilityResult {
  const matchedCriteria: string[] = [];
  const unmatchedCriteria: string[] = [];
  const missingCriteria: string[] = [];

  if (!profile) {
    return {
      status: 'MORE_INFO_REQUIRED',
      matchedCriteria: [],
      unmatchedCriteria: [],
      missingCriteria: ['Complete your citizen profile to check eligibility.'],
      summaryMessage: 'Please fill in your profile to check eligibility.'
    };
  }

  // 1. Age Verification
  if (profile.age !== undefined && profile.age !== null && profile.age > 0) {
    if (scheme.min_age !== null && scheme.max_age !== null) {
      if (profile.age >= scheme.min_age && profile.age <= scheme.max_age) {
        matchedCriteria.push(`Age (${profile.age} yrs) is within required range (${scheme.min_age} - ${scheme.max_age} yrs).`);
      } else {
        unmatchedCriteria.push(`Requires age between ${scheme.min_age} and ${scheme.max_age} yrs (current: ${profile.age} yrs).`);
      }
    } else if (scheme.min_age !== null) {
      if (profile.age >= scheme.min_age) {
        matchedCriteria.push(`Age (${profile.age} yrs) meets minimum requirement (${scheme.min_age}+ yrs).`);
      } else {
        unmatchedCriteria.push(`Requires minimum age of ${scheme.min_age} yrs (current: ${profile.age} yrs).`);
      }
    } else if (scheme.max_age !== null) {
      if (profile.age <= scheme.max_age) {
        matchedCriteria.push(`Age (${profile.age} yrs) is within maximum limit of ${scheme.max_age} yrs.`);
      } else {
        unmatchedCriteria.push(`Exceeds maximum age limit of ${scheme.max_age} yrs (current: ${profile.age} yrs).`);
      }
    } else {
      matchedCriteria.push('No age restrictions for this scheme.');
    }
  } else if (scheme.min_age !== null || scheme.max_age !== null) {
    missingCriteria.push('Age information required to evaluate age criteria.');
  }

  // 2. State & Location
  if (scheme.states && scheme.states.length > 0 && !scheme.states.includes('All')) {
    if (profile.state) {
      const matchState = scheme.states.some(s => s.toLowerCase() === profile.state?.toLowerCase());
      if (matchState) {
        matchedCriteria.push(`State matches (${profile.state} is covered).`);
      } else {
        unmatchedCriteria.push(`Scheme is available only in: ${scheme.states.join(', ')} (your state: ${profile.state}).`);
      }
    } else {
      missingCriteria.push('State location required to confirm geographic eligibility.');
    }
  } else {
    matchedCriteria.push('Applicable across all States and Union Territories in India.');
  }

  // 3. Occupation
  if (scheme.occupations && scheme.occupations.length > 0) {
    if (profile.occupation) {
      if (scheme.occupations.includes(profile.occupation)) {
        matchedCriteria.push(`Occupation matches (${profile.occupation}).`);
      } else {
        unmatchedCriteria.push(`Intended for: ${scheme.occupations.join(', ')} (your profile: ${profile.occupation}).`);
      }
    } else {
      missingCriteria.push('Occupation details required to check occupational eligibility.');
    }
  } else {
    matchedCriteria.push('Open across various occupations.');
  }

  // 4. Annual Family Income
  if (scheme.max_income !== null && scheme.max_income > 0) {
    if (profile.annual_family_income !== undefined && profile.annual_family_income !== null) {
      if (profile.annual_family_income <= scheme.max_income) {
        matchedCriteria.push(`Annual income (₹${profile.annual_family_income.toLocaleString('en-IN')}) is within limit (≤ ₹${scheme.max_income.toLocaleString('en-IN')}).`);
      } else {
        unmatchedCriteria.push(`Annual family income exceeds scheme limit of ₹${scheme.max_income.toLocaleString('en-IN')}.`);
      }
    } else {
      missingCriteria.push(`Income certificate/details needed (income limit: ₹${scheme.max_income.toLocaleString('en-IN')}).`);
    }
  }

  // 5. Gender
  if (scheme.gender_requirement && scheme.gender_requirement !== 'all') {
    if (profile.gender) {
      if (profile.gender === scheme.gender_requirement) {
        matchedCriteria.push(`Gender requirement met (${scheme.gender_requirement}).`);
      } else {
        unmatchedCriteria.push(`Restricted to ${scheme.gender_requirement} beneficiaries.`);
      }
    } else {
      missingCriteria.push('Gender information needed for verification.');
    }
  }

  // 6. Land Requirements
  if (scheme.requires_land) {
    if (profile.land_owned !== undefined && profile.land_owned !== null) {
      if (!profile.land_owned) {
        unmatchedCriteria.push('Requires agricultural land ownership (your profile: No land recorded).');
      } else {
        const area = profile.land_area ?? 0;
        let landOk = true;

        if (scheme.minimum_land_area !== null && area < scheme.minimum_land_area) {
          landOk = false;
          unmatchedCriteria.push(`Minimum land required: ${scheme.minimum_land_area} acres (you entered ${area} acres).`);
        }
        if (scheme.maximum_land_area !== null && area > scheme.maximum_land_area) {
          landOk = false;
          unmatchedCriteria.push(`Maximum landholding ceiling: ${scheme.maximum_land_area} acres (you entered ${area} acres).`);
        }

        if (landOk) {
          matchedCriteria.push(`Land ownership criteria satisfied (${area} acres owned).`);
        }
      }
    } else {
      missingCriteria.push('Land ownership details required to confirm eligibility.');
    }
  }

  // 7. Social Category (General, OBC, SC, ST)
  if (scheme.categories && scheme.categories.length > 0 && !scheme.categories.includes('All')) {
    if (profile.category) {
      if (scheme.categories.includes(profile.category)) {
        matchedCriteria.push(`Social category requirement met (${profile.category}).`);
      } else {
        unmatchedCriteria.push(`Restricted to categories: ${scheme.categories.join(', ')}.`);
      }
    } else {
      missingCriteria.push('Social category information required.');
    }
  }

  // 8. Special Conditions (Disability, Widow, Senior Citizen)
  if (scheme.disability_required) {
    if (profile.disability) {
      matchedCriteria.push('Person with Disability (PwD) condition met.');
    } else {
      unmatchedCriteria.push('Specifically designed for Persons with Disabilities.');
    }
  }

  if (scheme.widow_required) {
    if (profile.widow) {
      matchedCriteria.push('Widow support condition met.');
    } else {
      unmatchedCriteria.push('Specifically for widows from low-income households.');
    }
  }

  if (scheme.senior_citizen_required) {
    const isSenior = profile.senior_citizen || (profile.age !== undefined && profile.age >= 60);
    if (isSenior) {
      matchedCriteria.push('Senior citizen eligibility criteria met.');
    } else {
      unmatchedCriteria.push('Requires beneficiary to be a senior citizen (60+ years).');
    }
  }

  // Determine final status
  if (unmatchedCriteria.length > 0) {
    return {
      status: 'NOT_MATCHING',
      matchedCriteria,
      unmatchedCriteria,
      missingCriteria,
      summaryMessage: 'Not matching current criteria based on provided profile.'
    };
  }

  if (missingCriteria.length > 0) {
    return {
      status: 'MORE_INFO_REQUIRED',
      matchedCriteria,
      unmatchedCriteria,
      missingCriteria,
      summaryMessage: 'More profile details required to evaluate complete eligibility.'
    };
  }

  return {
    status: 'POTENTIALLY_ELIGIBLE',
    matchedCriteria,
    unmatchedCriteria: [],
    missingCriteria: [],
    summaryMessage: 'You may be eligible based on the information provided.'
  };
}

export const checkEligibility = evaluateEligibility;
