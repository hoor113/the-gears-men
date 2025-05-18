export class BaseGetAllResponse<T> {
    data: T[];
    totalRecords: number;

    constructor(data: T[] = [], totalRecords: number = 0) {
        this.data = data;
        this.totalRecords = totalRecords;
    }

    static build<T>( 
        data: T[] = [],
        totalRecords: number = 0,
    ): BaseGetAllResponse<T> {
        return new BaseGetAllResponse<T>(data, totalRecords);
    }

}
