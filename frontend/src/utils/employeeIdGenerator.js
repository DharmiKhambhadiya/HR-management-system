/**
 * Employee ID Generator Utility
 * Generates Employee ID in format: OIJD20220001
 * OI - Company Name initials
 * JD - First letter of First Name + First letter of Last Name
 * 2022 - Year of Joining
 * 0001 - Auto-incremented serial number for that year
 */

/**
 * Generate Employee ID
 * @param {string} companyName - Company name
 * @param {string} firstName - Employee first name
 * @param {string} lastName - Employee last name
 * @param {number|string} yearOfJoining - Year of joining
 * @param {number} serialNumber - Serial number for that year (default: 1)
 * @returns {string} Generated Employee ID
 */
export const generateEmployeeId = (
  companyName,
  firstName,
  lastName,
  yearOfJoining,
  serialNumber = 1
) => {
  // Get company initials (first two letters, uppercase)
  const companyInitials = companyName
    .replace(/[^a-zA-Z\s]/g, '') // Remove special characters
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
    .padEnd(2, 'X'); // Pad if less than 2 characters

  // Get name initials (first letter of first name + first letter of last name)
  const nameInitials =
    (firstName?.charAt(0) || 'X').toUpperCase() +
    (lastName?.charAt(0) || 'X').toUpperCase();

  // Get year (4 digits)
  const year = String(yearOfJoining).padStart(4, '0').substring(0, 4);

  // Get serial number (4 digits, zero-padded)
  const serial = String(serialNumber).padStart(4, '0');

  return `${companyInitials}${nameInitials}${year}${serial}`;
};

/**
 * Extract information from Employee ID
 * @param {string} employeeId - Employee ID to parse
 * @returns {object} Parsed information
 */
export const parseEmployeeId = (employeeId) => {
  if (!employeeId || employeeId.length !== 14) {
    return null;
  }

  return {
    companyInitials: employeeId.substring(0, 2),
    nameInitials: employeeId.substring(2, 4),
    year: employeeId.substring(4, 8),
    serialNumber: parseInt(employeeId.substring(8, 12), 10),
  };
};

