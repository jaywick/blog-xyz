import LogModel from "../models/log.model";
import * as moment from "moment";

export default class AdminLogsPresenter {
    logs;
    
    totalCount: number;
    prevPage: number;
    nextPage: number;
    currentPage: number;
    lastPage: number;
    isLastPage: boolean;
    isFirstPage: boolean;

    hasStatFilter: boolean;
    hasLogFilter: boolean;
    hasWarnFilter: boolean;
    hasFailFilter: boolean;

    constructor(logs: LogModel[], severityFilter, pagination: { index; limit; count }) {
        this.logs = logs.map(x => {
            x["localTime"] = moment(x.date).format("YYYY/MM/DD HH:mm:ss")
            x["iconClass"] = this.getSeverityIcon(x.severity);
            
            return x;
        });
        
        this.hasStatFilter = (!severityFilter || severityFilter === "stat" || severityFilter["$in"] && severityFilter["$in"].some(x => x === "stat") || severityFilter["$nin"] && !severityFilter["$nin"].some(x => x === "stat"));
        this.hasLogFilter = (!severityFilter || severityFilter === "log" || severityFilter["$in"] && severityFilter["$in"].some(x => x === "log") || severityFilter["$nin"] && !severityFilter["$nin"].some(x => x === "log"));
        this.hasWarnFilter = (!severityFilter || severityFilter === "warn" || severityFilter["$in"] && severityFilter["$in"].some(x => x === "warn") || severityFilter["$nin"] && !severityFilter["$nin"].some(x => x === "warn"));
        this.hasFailFilter = (!severityFilter || severityFilter === "fail" || severityFilter["$in"] && severityFilter["$in"].some(x => x === "fail") || severityFilter["$nin"] && !severityFilter["$nin"].some(x => x === "fail"));

        this.lastPage = Math.round(pagination.count / pagination.limit - 0.5);
        this.prevPage = pagination.index - 1;
        this.nextPage = pagination.index + 1;
        this.currentPage = pagination.index;
        this.totalCount = pagination.count;
        
        this.isFirstPage = pagination.index === 0;
        this.isLastPage = pagination.index === this.lastPage; 
    }

    private getSeverityIcon(severity: string): string {
        switch(severity) {
            case "stat": return "fa-check";
            case "log": return "fa-info-circle";
            case "warn": return "fa-warning";
            case "fail": return "fa-times-circle";
            default: return "";
        }
    }
}