import moment from "moment";

export default class Event {
  constructor(startDate, endDate, type, description){
    this.startDate = startDate;
    this.endDate = endDate;
    this.type = type;
    this.description = description;
  }

  clone(){
    return new Event(new moment(this.startDate), new moment(this.endDate), this.type, this.description);
  }

  startDate = null;
  endDate = null;
  type = null;
  description = null;
}