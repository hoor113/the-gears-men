import { BaseGetAllDto } from 'src/common/base-get-all-dto';

export function buildQuery<T extends BaseGetAllDto>(
    dto: T,
    searchableFields?: string[],
) {
    const query: any = {};

    if (dto.keyword && searchableFields?.length) {
        query.$or = searchableFields.map((field) => ({
            [field]: { $regex: dto.keyword, $options: 'i' },
        }));
    }

    Object.entries(dto).forEach(([key, value]) => {
        if (
            !['keyword', 'skipCount', 'maxResultCount'].includes(key) &&
            value !== undefined
        ) {
            query[key] = value;
        }
    });

    return query;
}
