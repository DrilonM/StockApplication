export const parseFromMacedonianToNumber = (str) => {
    if (!str) return 0;
    const normalizedStr = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(normalizedStr);
    return isNaN(num) ? 0 : num;
};


export const convertDateFormat = (dateStr) => {
    const parts = dateStr.split('.');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export const formatNumberToMacedonian = (num) => {
    if (isNaN(num)) return num;
    if (typeof num !== 'number') parseFloat(num)

    const isNegative = num < 0;
    num = Math.abs(num);

    const [integerPart, decimalPart] = num.toFixed(2).split('.');

    const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formattedNumber = `${withThousands},${decimalPart}`;

    return isNegative ? `-${formattedNumber}` : formattedNumber;
};

export const formatDateToMacedonian = (dateStr, type = "-") => {
    if (typeof dateStr !== 'string') return dateStr;

    const parts = dateStr.split(type);

    if (parts.length !== 3) return dateStr;

    const [year, month, day] = parts;

    const isValidYear = /^\d{4}$/.test(year);
    const isValidMonth = /^(0[1-9]|1[0-2])$/.test(month);
    const isValidDay = /^(0[1-9]|[12]\d|3[01])$/.test(day);

    if (!isValidYear || !isValidMonth || !isValidDay) return dateStr;

    return `${day}.${month}.${year}`;
};

export const formatDateToMacedonianVersion2 = (dateStr, type = "/") => {
    if (typeof dateStr !== 'string') return dateStr;

    const parts = dateStr.split(type);

    if (parts.length !== 3) return dateStr;

    const [month, day, year] = parts;


    return `${day}.${month}.${year}`;
};

export const formatNumberToMacedonianAndDen = (num) => {
    return formatNumberToMacedonian(num)+"den";
};
