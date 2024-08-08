type DBObject = {
    id: number;
    created_at: string;
    updated_at: string;
};

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type Schedule = DBObject & {
    cycle_length: number;
    items: { label: string; start: number; color: string; vpd: number; lightHours: number }[];
    is_active: boolean;
    start_date: string | null;
};

export const VPDs = [
    {
        color: '#1A6C9C',
        vpd_range: '<0.4 kPa',
        median_vpd_value: 0.2,
        description: 'Danger Zone (Under Transpiration)',
    },
    {
        color: '#22AB9C',
        vpd_range: '0.4-0.8 kPa',
        median_vpd_value: 0.6,
        description: 'Early Vegetative Growth / Propagation (Low Transpiration)',
    },
    {
        color: '#9CC55B',
        vpd_range: '0.8-1.2 kPa',
        median_vpd_value: 1.0,
        description: 'Late Vegetative / Early Flower (Healthy Transpiration)',
    },
    {
        color: '#E7C12B',
        vpd_range: '1.2-1.6 kPa',
        median_vpd_value: 1.4,
        description: 'Mid / Late Flower (High Transpiration)',
    },
    {
        color: '#CE4234',
        vpd_range: '>1.6 kPa',
        median_vpd_value: 1.8,
        description: 'Danger Zone (Over Transpiration)',
    },
];
