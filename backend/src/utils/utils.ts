import { BaseGetAllDto } from '@/common/base-get-all-dto';

export enum EExtraConditionType {
    InRange = 'inRange',
    Equals = 'equals',
    NotEquals = 'notEquals',
    In = 'in',
    NotIn = 'notIn',
    Exists = 'exists',
    Regex = 'regex',
}

export interface IExtraCondition {
    field: string;
    type: EExtraConditionType;
    fromField?: string;    // dùng cho InRange
    toField?: string;      // dùng cho InRange
    valueField?: string;   // dùng cho các loại còn lại
}


export function buildQuery<T extends BaseGetAllDto>(
    dto: T,
    searchableFields?: string[],
    extraCondition?: IExtraCondition[],
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

    extraCondition?.forEach((condition) => {
        const { field, type } = condition;

        switch (type) {
            case EExtraConditionType.InRange: {
                const from = condition.fromField ? (dto as Record<string, any>)[condition.fromField] : undefined;
                const to = condition.toField ? (dto as Record<string, any>)[condition.toField] : undefined;
                if (from !== undefined || to !== undefined) {
                    query[field] = {
                        ...(from !== undefined ? { $gte: from } : {}),
                        ...(to !== undefined ? { $lte: to } : {}),
                    };
                }
                break;
            }

            case EExtraConditionType.Equals: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (val !== undefined) {
                    query[field] = val;
                }
                break;
            }

            case EExtraConditionType.NotEquals: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (val !== undefined) {
                    query[field] = { $ne: val };
                }
                break;
            }

            case EExtraConditionType.In: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (Array.isArray(val) && val.length) {
                    query[field] = { $in: val };
                }
                break;
            }

            case EExtraConditionType.NotIn: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (Array.isArray(val) && val.length) {
                    query[field] = { $nin: val };
                }
                break;
            }

            case EExtraConditionType.Exists: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (typeof val === 'boolean') {
                    query[field] = { $exists: val };
                }
                break;
            }

            case EExtraConditionType.Regex: {
                const val = condition.valueField ? (dto as Record<string, any>)[condition.valueField] : undefined;
                if (typeof val === 'string' && val.length) {
                    query[field] = { $regex: val, $options: 'i' };
                }
                break;
            }
        }
    });

    return query;
}
