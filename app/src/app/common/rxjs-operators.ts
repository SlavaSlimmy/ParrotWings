// import 'rxjs/Rx'; // adds ALL RxJS statics & operators to Observable

// See node_module/rxjs/Rxjs.js
// Import just the rxjs statics and operators we need for THIS app.

// Statics
import 'lib/rxjs/add/observable/throw';

// Operators
import 'lib/rxjs/add/operator/catch';
import 'lib/rxjs/add/operator/debounceTime';
import 'lib/rxjs/add/operator/distinctUntilChanged';
import 'lib/rxjs/add/operator/map';
import 'lib/rxjs/add/operator/switchMap';
import 'lib/rxjs/add/operator/toPromise';