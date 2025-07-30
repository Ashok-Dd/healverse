export const validateUserForm = (username: string, age: string): string | null => {
    if (!username.trim()) {
        return 'Username is required';
    }
    if (username.length < 2) {
        return 'Username must be at least 2 characters';
    }
    if (!age.trim()) {
        return 'Age is required';
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return 'Please enter a valid age (1-120)';
    }
    return null;
};
