import { Model } from 'mongoose'

export const getAll = (model: Model<any>) => {
    return model.find().lean()
        .then(charts => {
            if (charts.length) {
                return charts.map(chart => {
                    chart.id = String(chart._id);
                    return chart;
                });
            }

            return [];
        })
        .catch(err => {
            throw new Error(err);
        });
}