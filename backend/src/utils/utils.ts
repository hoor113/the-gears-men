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

    const excludedFields = new Set<string>();
    extraCondition?.forEach((cond) => {
        if (cond.valueField) excludedFields.add(cond.valueField);
        if (cond.fromField) excludedFields.add(cond.fromField);
        if (cond.toField) excludedFields.add(cond.toField);
    });

    Object.entries(dto).forEach(([key, value]) => {
        if (
            !['keyword', 'skipCount', 'maxResultCount'].includes(key) &&
            !excludedFields.has(key) &&
            value !== undefined
        ) {
            query[key] = value;
        }
    });

    extraCondition?.forEach((condition) => {
        const { field, type } = condition;

        switch (type) {
            case EExtraConditionType.InRange: {
                const dtoRecord = dto as Record<string, any>;
            
                const fromValue = condition.fromField ? dtoRecord[condition.fromField] : undefined;
                const toValue = condition.toField ? dtoRecord[condition.toField] : undefined;
            
                const hasFrom = fromValue !== undefined && fromValue !== null;
                const hasTo = toValue !== undefined && toValue !== null;
            
                if (!hasFrom && !hasTo) break; // bỏ qua nếu không có cả hai
            
                const from = hasFrom ? fromValue : 0;
                const to = hasTo ? toValue : Number.MAX_SAFE_INTEGER;
                query[field] = {
                    $gte: from,
                    $lte: to,
                };
            
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
