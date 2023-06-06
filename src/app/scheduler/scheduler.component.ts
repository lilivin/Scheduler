import {
  Component,
  ViewChild,
  AfterViewInit,
  DoCheck,
  HostListener,
} from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { DataService } from './data.service';
{
}

@Component({
  selector: 'scheduler-component',
  template: ` <div class="controls">
      <button id="minus" (click)="minus()">-</button>
      <input type="range" min="0" max="3" step="1" [(ngModel)]="config.zoom" />
      <button id="plus" (click)="plus()">+</button>
      <span id="label">{{ currentZoomLevelName }}</span>
    </div>
    <div class="space">
      Filter:
      <input
        type="text"
        [ngModel]="filter.text"
        (ngModelChange)="changeText($event)"
      />
    </div>
    <daypilot-scheduler
      [config]="config"
      [events]="events"
      #scheduler
    ></daypilot-scheduler>`,

  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements AfterViewInit, DoCheck {
  @ViewChild('scheduler')
  scheduler!: DayPilotSchedulerComponent;

  events: DayPilot.EventData[] = [];

  filter = {
    text: '',
  };

  onChange(deviceValue: any) {
    console.log(deviceValue);
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    const delta = Math.sign(event.deltaY);
    if (delta === -1) {
      this.plus();
    } else {
      this.minus();
    }
  }

  config: DayPilot.SchedulerConfig = {
    onTimeRangeSelected: (args) => {
      var dp = this.scheduler.control;
      DayPilot.Modal.prompt('Create a new event:', 'Event 1').then((modal) => {
        dp.clearSelection();
        if (modal.canceled) {
          return;
        }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result,
        });
      });
    },
    treeEnabled: true,
    zoom: 1,
    zoomPosition: 'middle',
    // onTimeHeaderClick: args => {
    //   this.plus()
    // },
    timeFormat: 'Clock12Hours',
    onEventClick: (args: any) => {
      args.e.data.text = 'Text Edited';
    },
    onCellMouseEnter: (args: any) => {
      console.log(args)
    },
    // onRowMouseOver: (args: any) => {
    //   console.log(args.row.cells.all().forEach((cell: any) => cell.div.className += cell.div.className + " active"))
    // },
    onRowFilter: (args: any) => {
      if (
        args.row.name.toLowerCase().indexOf(args.filter.text.toLowerCase()) < 0
      ) {
        args.visible = false;
      }
      var parent = args.row.parent();
      if (parent && !parent.hiddenUsingFilter) {
        args.visible = true;
      }
    },
    zoomLevels: [
      {
        name: 'Year',
        properties: {
          scale: 'Day',
          cellWidth: 40,
          timeHeaders: [
            { groupBy: 'Year' },
            { groupBy: 'Month', format: 'MMMM' },
            { groupBy: 'Day', format: 'd' },
          ],
          startDate: (args: ZoomLevelCallbackArgs) => {
            return args.date.firstDayOfYear();
          },
          days: (args: ZoomLevelCallbackArgs) => {
            return args.date.daysInYear();
          },
        },
      },
      {
        name: 'Month',
        properties: {
          scale: 'CellDuration',
          cellDuration: 720,
          cellWidth: 40,
          timeHeaders: [
            { groupBy: 'Month' },
            { groupBy: 'Day', format: 'ddd d' },
            { groupBy: 'Cell', format: 'tt' },
          ],
          startDate: (args: ZoomLevelCallbackArgs) => {
            return args.date.firstDayOfMonth();
          },
          days: (args: ZoomLevelCallbackArgs) => {
            return args.date.daysInMonth();
          },
        },
      },
      {
        name: 'Week',
        properties: {
          scale: 'Hour',
          cellWidth: 40,
          timeHeaders: [
            { groupBy: 'Month' },
            { groupBy: 'Day', format: 'dddd d' },
            { groupBy: 'Hour' },
          ],
          startDate: (args: ZoomLevelCallbackArgs) => {
            return args.date.firstDayOfWeek();
          },
          days: (_args: ZoomLevelCallbackArgs) => {
            return 7;
          },
        },
      },
      {
        name: '3 Days',
        properties: {
          scale: 'Hour',
          cellWidth: 40,
          timeHeaders: [
            { groupBy: 'Month' },
            { groupBy: 'Day', format: 'dddd d' },
            { groupBy: 'Hour' },
          ],
          startDate: (args: ZoomLevelCallbackArgs) => {
            return args.date.getDatePart();
          },
          days: (_args: ZoomLevelCallbackArgs) => {
            return 3;
          },
        },
      },
      {
        name: 'Hour',
        properties: {
          scale: 'CellDuration',
          cellDuration: 15,
          cellWidth: 40,
          timeHeaders: [
            { groupBy: 'Day', format: 'dddd MMMM d, yyyy' },
            { groupBy: 'Hour' },
            { groupBy: 'Cell' },
          ],
          startDate: (args: ZoomLevelCallbackArgs) => {
            return args.date.getDatePart();
          },
          days: (_args: ZoomLevelCallbackArgs) => {
            return 1;
          },
        },
      },
    ],
  };

  changeText(text: string): void {
    this.filter.text = text;
    this.applyFilter();
  }

  applyFilter(): void {
    this.scheduler.control.rows.filter(this.filter);
  }

  constructor(private ds: DataService) {}

  plus(): void {
    // checking boundaries
    const zoomLevels = this.config.zoomLevels as Array<any>;
    this.config.zoom = Math.min(
      (this.config.zoom as number) + 1,
      zoomLevels.length - 1
    );
  }

  minus(): void {
    // checking boundaries
    this.config.zoom = Math.max((this.config.zoom as number) - 1, 0);
  }

  get currentZoomLevelName() {
    const zoomLevels = this.config.zoomLevels as Array<any>;
    const currentLevel = this.config.zoom as number;
    return zoomLevels[currentLevel].name;
  }

  ngDoCheck(): void {}

  ngAfterViewInit(): void {
    this.ds
      .getResources()
      .subscribe((result) => (this.config.resources = result));

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe((result) => {
      this.events = result;
    });
  }
}

export interface ZoomLevelCallbackArgs {
  date: DayPilot.Date;
  level: number;
}
