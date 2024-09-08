export default function load(level) {
    if(level === 1) {
        return [
            3, 5, 1, 3,
            1, 1, 1, 1,
            3, 4, 1, 3,
            1, 2, 2, 1,
            2, 0, 0, 2
        ];
    } else if(level === 2) {
        return [
            3, 5, 1, 3,
            1, 1, 1, 1,
            3, 4, 1, 2,
            1, 4, 1, 2,
            2, 0, 0, 2
        ];
    } else if(level === 3) {
        return [
            2, 2, 2, 3,
            5, 1, 3, 1,
            1, 1, 1, 3,
            0, 4, 1, 1,
            0, 2, 4, 1
        ];
    } else if(level === 4) {
        return [
            0, 5, 1, 0,
            2, 1, 1, 2,
            3, 4, 1, 3,
            1, 4, 1, 1,
            2, 4, 1, 2
        ];
    } else if(level === 5) {
        return [
            2, 4, 1, 2,
            3, 5, 1, 3,
            1, 1, 1, 1,
            4, 1, 4, 1,
            2, 0, 0, 2
        ];
    } else if(level === 6) {
        return [
            2, 5, 1, 2,
            3, 1, 1, 3,
            1, 4, 1, 1,
            2, 4, 1, 2,
            0, 4, 1, 0
        ];
    } else if(level === 7) {
        return [
            2, 5, 1, 3,
            2, 1, 1, 1,
            2, 2, 4, 1,
            3, 4, 1, 3,
            1, 0, 0, 1
        ];
    } else {
        return null;
    }
}