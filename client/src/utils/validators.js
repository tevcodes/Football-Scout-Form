export function getMaxDateForAge(ageLimit) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - ageLimit);;
    return today.toISOString().split('T')[0];
}

export function isValidPhoneNumber(phone) {
    const regex = /^0\d{9}$/;
    return regex.test(phone);
}