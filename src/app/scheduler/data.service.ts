import { Injectable } from '@angular/core';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  resources: any[] = [
    {
      name: 'Group A',
      id: 'GA',
      expanded: true,
      children: [
        { name: 'Resource 1', id: 'R1' },
        { name: 'Resource 2', id: 'R2' },
        { name: 'Resource 3', id: 'R3' },
      ],
    },
    {
      name: 'Group B',
      id: 'GB',
      expanded: true,
      children: [
        { name: 'Resource 4', id: 'R4' },
        { name: 'Resource 5', id: 'R5' },
        { name: 'Resource 6', id: 'R6' },
      ],
    },
  ];

  events: any[] = [
    {
      id: '1',
      resource: 'GA',
      start: '2023-06-12:00:00:00',
      end: '2023-06-16:00:00:00',
      text: 'Category 1',
      color: '#e69138',
      training: true,
    },
    {
      id: '2',
      resource: 'R1',
      start: '2023-06-12:00:00:00',
      end: '2023-06-13:00:00:00',
      text: 'Event 1.1',
      color: '#6aa84f',
      training: true,
    },
    {
      id: '3',
      resource: 'R2',
      start: '2023-06-13:00:00:00',
      end: '2023-06-15:00:00:00',
      text: 'Event 1/2',
      color: '#3c78d8',
      training: true,
    },
    {
      id: '4',
      resource: 'R3',
      start: '2023-06-15:00:00:00',
      end: '2023-06-16:00:00:00',
      text: 'Event 1.3',
      color: '#3c78d8',
      training: true,
    },
    {
      id: '5',
      resource: 'GB',
      start: '2023-06-13:00:00:00',
      end: '2023-06-17:00:00:00',
      text: 'Category 2',
      color: '#e69138',
      training: true,
    },
    {
      id: '6',
      resource: 'R4',
      start: '2023-06-13:00:00:00',
      end: '2023-06-14:00:00:00',
      text: 'Event 2.1',
      color: '#6aa84f',
      training: true,
    },
    {
      id: '7',
      resource: 'R5',
      start: '2023-06-14:00:00:00',
      end: '2023-06-15:00:00:00',
      text: 'Event 2.2',
      color: '#3c78d8',
      training: true,
    },
    {
      id: '8',
      resource: 'R6',
      start: '2023-06-15:00:00:00',
      end: '2023-06-17:00:00:00',
      text: 'Event 2.3',
      color: '#3c78d8',
      training: true,
    }
  ];

  constructor(private http: HttpClient) {}

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    // simulating an HTTP request
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {
    // simulating an HTTP request
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });

    // return this.http.get("/api/resources");
  }
}
