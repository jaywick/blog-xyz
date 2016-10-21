import Regex from "./regex";
import * as moment from "moment";

export default class QueryOptions {

    constructor(private request) {
    }

    get filter(): {} {
        const filterString = <string>this.request.query["filter"];

        if (!filterString)
            return {};

        const result = {};
        let filters = filterString.split(";");

        filters.forEach(filter => {
            let filterParts = filter.split(":", 2);
            let fieldName = filterParts[0];
            let conditionString = filterParts[1];
            let conditionObject: string | {} = conditionString;

            if (conditionString === "")
                conditionObject = { "$exists": false, "$eq": "" };
            else if (conditionString === "!")
                conditionObject = { "$exists": true, "$ne": "" };
            else {
                // in array
                if (conditionString.includes(","))
                    conditionObject = { "$in": conditionString.split(",") };

                // not in array
                if (conditionString.includes(",") && conditionString.startsWith("!"))
                    conditionObject = { "$nin": conditionString.substring(1).split(",") };

                // not
                else if (conditionString.startsWith("!"))
                    conditionObject = { "$ne": conditionString.substring(1) };

                // greater than date
                else if (conditionString.startsWith("@>"))
                    conditionObject = { "$gte": this.parseDateCondition(conditionString.substring(2))[0] };

                // less than date
                else if (conditionString.startsWith("@<"))
                    conditionObject = { "$lte": this.parseDateCondition(conditionString.substring(2))[0] };

                // date
                else if (conditionString.startsWith("@")) {
                    let range: { start; end };

                    // date between
                    if (conditionString.includes("-")) {
                        const givenRange = conditionString.substring(1)
                            .split("-", 2)
                            .map(x => this.parseDateCondition(x));

                        range = { start: givenRange[0].start, end: givenRange[1].end };
                    } else {
                        range = this.parseDateCondition(conditionString.substring(1));
                    }

                    conditionObject = { "$gte": range.start, "$lte": range.end };
                }

                // greater than or equal
                else if (conditionString.startsWith(">"))
                    conditionObject = { "$gte": conditionString.substring(1) };

                // less than or equal
                else if (conditionString.startsWith("<"))
                    conditionObject = { "$lte": conditionString.substring(1) };

                // not like
                else if (conditionString.startsWith("~!"))
                    conditionObject = { "$not": Regex.fromGlob(conditionString.substring(2)) };
                
                // like
                else if (conditionString.startsWith("~"))
                    conditionObject = Regex.fromGlob(conditionString.substring(1));
            }

            result[fieldName] = conditionObject;
        });

        return result;
    }

    private parseDateCondition(value: string): { start: Date; end: Date } {
        const pattern = /^(\d\d\d\d)(\d\d)?(\d\d)?T?(\d\d)?(\d\d)?(\d\d)?(Z)?$/i;
        const result = pattern.exec(value);

        if (!result || result.length === 0)
            throw new Error("Invalid url query date format " + value);

        const years = result[1] && [+result[1], +result[1]];
        const months = result[2] && [+result[2] - 1, +result[2] - 1] || [0, 11];
        const days = result[3] && [+result[3], +result[3]] || [1, moment([years[1], months[1]]).endOf("month").date()];
        const hours = result[4] && [+result[4], +result[4]] || [0, 23];
        const minutes = result[5] && [+result[5], +result[5]] || [0, 59];
        const seconds = result[6] && [+result[6], +result[6]] || [0, 59];
        const isUtc = !!result[7];

        const startDateArray = ([years[0], months[0], days[0], hours[0], minutes[0], seconds[0], 0]);
        const endDateArray = ([years[1], months[1], days[1], hours[1], minutes[1], seconds[1], 999]);

        if (isUtc)
            return { start: moment.utc(startDateArray).toDate(), end: moment.utc(endDateArray).toDate() }
        else
            return { start: moment(startDateArray).toDate(), end: moment(endDateArray).toDate() }
    }

    get sort(): { field; isDescending } {
        let isDescending = false;
        let sort = this.request.query["sort"];

        if (!sort)
            return null;

        if (sort.startsWith("-")) {
            sort = sort.substring(1); // skip '-' sign
            isDescending = true;
        }

        return { field: sort, isDescending: isDescending }
    }

    get page(): number {
        return +(this.request.query["page"] || 0);
    }

    get limit(): number {
        const limit = this.request.query["limit"];

        if (!limit)
            return;

        return +limit;
    }
}