/** [[include:doc/result.md]] */

/** (keep typedoc from getting confused by the import) */
import Maybe, { isJust, just, nothing } from './maybe';
import Unit from './unit';
import { _Brand, curry1, isVoid } from './utils';

// So that it doesn't appear unused but can be exported.
_Brand; // tslint:disable-line:no-unused-expression

/**
  Discriminant for `Ok` and `Err` variants of `Result` type.

  You can use the discriminant via the `variant` property of `Result` instances
  if you need to match explicitly on it.
 */
export enum Variant {
  Ok = 'Ok',
  Err = 'Err',
}

export interface ResultShape<T, E> {
  /** Distinguish between the `Ok` and `Err` variants. */
  variant: Variant;

  /** Method variant for [`Result.isOk`](../modules/_result_.html#isok) */
  isOk(this: Result<T, E>): this is Ok<T, E>;

  /** Method variant for [`Result.isErr`](../modules/_result_.html#iserr) */
  isErr(this: Result<T, E>): this is Err<T, E>;

  /** Method variant for [`Result.map`](../modules/_result_.html#map) */
  map<U>(this: Result<T, E>, mapFn: (t: T) => U): Result<U, E>;

  /** Method variant for [`Result.mapOr`](../modules/_result_.html#mapor) */
  mapOr<U>(this: Result<T, E>, orU: U, mapFn: (t: T) => U): U;

  /** Method variant for [`Result.mapOrElse`](../modules/_result_.html#maporelse) */
  mapOrElse<U>(this: Result<T, E>, orElseFn: (err: E) => U, mapFn: (t: T) => U): U;

  /** Method variant for [`Result.match`](../modules/_result_.html#match) */
  match<U>(this: Result<T, E>, matcher: Matcher<T, E, U>): U;

  /** Method variant for [`Result.mapErr`](../modules/_result_.html#maperr) */
  mapErr<F>(this: Result<T, E>, mapErrFn: (e: E) => F): Result<T, F>;

  /** Method variant for [`Result.or`](../modules/_result_.html#or) */
  or<F>(this: Result<T, E>, orResult: Result<T, F>): Result<T, F>;

  /** Method variant for [`Result.orElse`](../modules/_result_.html#orelse) */
  orElse<F>(this: Result<T, E>, orElseFn: (err: E) => Result<T, F>): Result<T, F>;

  /** Method variant for [`Result.and`](../modules/_result_.html#and) */
  and<U>(this: Result<T, E>, mAnd: Result<U, E>): Result<U, E>;

  /** Method variant for [`Result.andThen`](../modules/_result_.html#andthen) */
  andThen<U>(this: Result<T, E>, andThenFn: (t: T) => Result<U, E>): Result<U, E>;

  /** Method variant for [`Result.chain`](../modules/_result_.html#chain) */
  chain<U>(this: Result<T, E>, chainFn: (t: T) => Result<U, E>): Result<U, E>;

  /** Method variant for [`Result.flatMap`](../modules/_result_.html#flatmap) */
  flatMap<U>(this: Result<T, E>, chainFn: (t: T) => Result<U, E>): Result<U, E>;

  /** Method variant for [`Result.unwrap`](../modules/_result_.html#unwrap) */
  unsafelyUnwrap(): T | never;

  /** Method variant for [`Result.unwrapErr`](../modules/_result_.html#unwraperr) */
  unsafelyUnwrapErr(): E | never;

  /** Method variant for [`Result.unwrapOr`](../modules/_result_.html#unwrapor) */
  unwrapOr(this: Result<T, E>, defaultValue: T): T;

  /** Method variant for [`Result.unwrapOrElse`](../modules/_result_.html#unwrapOrElse) */
  unwrapOrElse(this: Result<T, E>, elseFn: (error: E) => T): T;

  /** Method variant for [`Result.toMaybe`](../modules/_result_.html#tomaybe) */
  toMaybe(this: Result<T, E>): Maybe<T>;

  /** Method variant for [`Result.toString`](../modules/_result_.html#tostring) */
  toString(this: Result<T, E>): string;
}

/**
  An `Ok` instance is the *successful* variant instance of the
  [`Result`](../modules/_result_.html#result) type, representing a successful
  outcome from an operation which may fail. For a full discussion, see [the
  module docs](../modules/_result_.html).

  @typeparam T The type wrapped in this `Ok` variant of `Result`.
  @typeparam E The type which would be wrapped in an `Err` variant of `Result`.
 */
export class Ok<T, E> implements ResultShape<T, E> {
  /** `Ok` is always [`Variant.Ok`](../enums/_result_.variant#ok). */
  variant = Variant.Ok;

  private value: T;

  /**
    Create an instance of `Result.Ok` with `new`.

    Note: While you *may* create the `Result` type via normal
    JavaScript class construction, it is not recommended for the functional
    style for which the library is intended. Instead, use [`Result.ok`].

    [`Result.ok`]: ../modules/_result_.html#ok

    ```ts
    // Avoid:
    const aString = new Result.Ok('characters');

    // Prefer:
    const aString = Result.ok('characters);
    ```

    Note that you may explicitly pass `Unit` to the `Ok` constructor to create
    a `Result<Unit, E>`. However, you may *not* call the `Ok` constructor with
    `null` or `undefined` to get that result (the type system won't allow you to
    construct it that way). Instead, for convenience, you can simply call
    `Result.ok()`, which will construct the type correctly.

    @param value
    The value to wrap in a `Result.Ok`.

    Note: `null` and `undefined` are allowed by the type signature so that the
    constructor may `throw` on those rather than constructing a type like
    `Result<undefined>`.

    @throws If you pass `null`.
   */
  constructor(value?: T | null) {
    if (isVoid(value)) {
      throw new Error(
        'Tried to construct `Ok` with `null` or `undefined`. Maybe you want `Maybe.Nothing`?'
      );
    }

    this.value = value;
  }

  /** Method variant for [`Result.isOk`](../modules/_result_.html#isok) */
  isOk(this: Result<T, E>): this is Ok<T, E> {
    return isOk(this);
  }

  /** Method variant for [`Result.isErr`](../modules/_result_.html#iserr) */
  isErr(this: Result<T, E>): this is Err<T, E> {
    return isErr(this);
  }

  /** Method variant for [`Result.map`](../modules/_result_.html#map) */
  map<U>(this: Result<T, E>, mapFn: (t: T) => U): Result<U, E> {
    return map(mapFn, this);
  }

  /** Method variant for [`Result.mapOr`](../modules/_result_.html#mapor) */
  mapOr<U>(this: Result<T, E>, orU: U, mapFn: (t: T) => U): U {
    return mapOr(orU, mapFn, this);
  }

  /** Method variant for [`Result.mapOrElse`](../modules/_result_.html#maporelse) */
  mapOrElse<U>(this: Result<T, E>, orElseFn: (err: E) => U, mapFn: (t: T) => U): U {
    return mapOrElse(orElseFn, mapFn, this);
  }

  /** Method variant for [`Result.match`](../modules/_result_.html#match) */
  match<U>(this: Result<T, E>, matcher: Matcher<T, E, U>): U {
    return match(matcher, this);
  }

  /** Method variant for [`Result.mapErr`](../modules/_result_.html#maperr) */
  mapErr<F>(this: Result<T, E>, mapErrFn: (e: E) => F): Result<T, F> {
    return mapErr(mapErrFn, this);
  }

  /** Method variant for [`Result.or`](../modules/_result_.html#or) */
  or<F>(this: Result<T, E>, orResult: Result<T, F>): Result<T, F> {
    return or(orResult, this);
  }

  /** Method variant for [`Result.orElse`](../modules/_result_.html#orelse) */
  orElse<F>(this: Result<T, E>, orElseFn: (err: E) => Result<T, F>): Result<T, F> {
    return orElse(orElseFn, this);
  }

  /** Method variant for [`Result.and`](../modules/_result_.html#and) */
  and<U>(this: Result<T, E>, mAnd: Result<U, E>): Result<U, E> {
    return and(mAnd, this);
  }

  /** Method variant for [`Result.andThen`](../modules/_result_.html#andthen) */
  andThen<U>(this: Result<T, E>, andThenFn: (t: T) => Result<U, E>): Result<U, E> {
    return andThen(andThenFn, this);
  }

  /** Method variant for [`Result.chain`](../modules/_result_.html#chain) */
  chain<U>(this: Result<T, E>, chainFn: (t: T) => Result<U, E>): Result<U, E> {
    return chain(chainFn, this);
  }

  /** Method variant for [`Result.flatMap`](../modules/_result_.html#flatmap) */
  flatMap<U>(this: Result<T, E>, flatMapFn: (t: T) => Result<U, E>): Result<U, E> {
    return flatMap(flatMapFn, this);
  }

  /** Method variant for [`Result.unwrap`](../modules/_result_.html#unwrap) */
  unsafelyUnwrap(): T {
    return this.value;
  }

  /** Method variant for [`Result.unwrapErr`](../modules/_result_.html#unwraperr) */
  unsafelyUnwrapErr(): never {
    throw new Error('Tried to `unsafelyUnwrapErr` an `Ok`');
  }

  /** Method variant for [`Result.unwrapOr`](../modules/_result_.html#unwrapor) */
  unwrapOr(this: Result<T, E>, defaultValue: T): T {
    return unwrapOr(defaultValue, this);
  }

  /** Method variant for [`Result.unwrapOrElse`](../modules/_result_.html#unwrapOrElse) */
  unwrapOrElse(this: Result<T, E>, elseFn: (error: E) => T): T {
    return unwrapOrElse(elseFn, this);
  }

  /** Method variant for [`Result.toMaybe`](../modules/_result_.html#tomaybe) */
  toMaybe(this: Result<T, E>): Maybe<T> {
    return toMaybe(this);
  }

  /** Method variant for [`Result.toString`](../modules/_result_.html#tostring) */
  toString(this: Result<T, E>): string {
    return toString(this);
  }
}

/**
  An `Err` instance is the *failure* variant instance of the
  [`Result`](../modules/_result_.html#result) type, representing a failure
  outcome from an operation which may fail. For a full discussion, see [the
  module docs](../modules/_result_.html).

  @typeparam T The type which would be wrapped in an `Ok` variant of `Result`.
  @typeparam E The type wrapped in this `Err` variant of `Result`.
  */
export class Err<T, E> implements ResultShape<T, E> {
  /** `Err` is always [`Variant.Err`](../enums/_result_.variant#err). */
  variant = Variant.Err;

  private error: E;

  /**
    Create an instance of `Result.Err` with `new`.

    Note: While you *may* create the `Result` type via normal
    JavaScript class construction, it is not recommended for the functional
    style for which the library is intended. Instead, use [`Result.err`].

    [`Result.err`]: ../modules/_result_.html#err

    ```ts
    // Avoid:
    const anErr = new Result.Err('alas, failure');

    // Prefer:
    const anErr = Result.err('alas, failure');
    ```

    Note that you may explicitly pass `Unit` to the `Err` constructor to create
    a `Result<T, Unit>`. However, you may *not* call the `Err` constructor with
    `null` or `undefined` to get that result (the type system won't allow you to
    construct it that way). Instead, for convenience, you can simply call
    `Result.err()`, which will construct the type correctly.

    @param error
    The value to wrap in a `Result.Err`.

    `Note: null` and `undefined` are allowed by the type signature so that the
    constructor may `throw` on those rather than constructing a type like
    `Result<number, undefined>`.

    @throws If you pass `null` or `undefined`.
   */
  constructor(error: E | null) {
    if (isVoid(error)) {
      throw new Error(
        'Tried to construct `Err` with `null` or `undefined`. Maybe you want `Maybe.Nothing`?'
      );
    }

    this.error = error;
  }

  /** Method variant for [`Result.isOk`](../modules/_result_.html#isok) */
  isOk(this: Result<T, E>): this is Ok<T, E> {
    return isOk(this);
  }

  /** Method variant for [`Result.isErr`](../modules/_result_.html#iserr) */
  isErr(this: Result<T, E>): this is Err<T, E> {
    return isErr(this);
  }

  /** Method variant for [`Result.map`](../modules/_result_.html#map) */
  map<U>(this: Result<T, E>, mapFn: (t: T) => U): Result<U, E> {
    return map(mapFn, this);
  }

  /** Method variant for [`Result.mapOr`](../modules/_result_.html#mapor) */
  mapOr<U>(this: Result<T, E>, orU: U, mapFn: (t: T) => U): U {
    return mapOr(orU, mapFn, this);
  }

  /** Method variant for [`Result.mapOrElse`](../modules/_result_.html#maporelse) */
  mapOrElse<U>(this: Result<T, E>, orElseFn: (err: E) => U, mapFn: (t: T) => U): U {
    return mapOrElse(orElseFn, mapFn, this);
  }

  /** Method variant for [`Result.match`](../modules/_result_.html#match) */
  match<U>(this: Result<T, E>, matchObj: Matcher<T, E, U>): U {
    return match(matchObj, this);
  }

  /** Method variant for [`Result.mapErr`](../modules/_result_.html#maperr) */
  mapErr<F>(this: Result<T, E>, mapErrFn: (e: E) => F): Result<T, F> {
    return mapErr(mapErrFn, this);
  }

  /** Method variant for [`Result.or`](../modules/_result_.html#or) */
  or<F>(this: Result<T, E>, orResult: Result<T, F>): Result<T, F> {
    return or(orResult, this);
  }

  /** Method variant for [`Result.orElse`](../modules/_result_.html#orelse) */
  orElse<F>(this: Result<T, E>, orElseFn: (err: E) => Result<T, F>): Result<T, F> {
    return orElse(orElseFn, this);
  }

  /** Method variant for [`Result.and`](../modules/_result_.html#and) */
  and<U>(this: Result<T, E>, mAnd: Result<U, E>): Result<U, E> {
    return and(mAnd, this);
  }

  /** Method variant for [`Result.andThen`](../modules/_result_.html#andthen) */
  andThen<U>(this: Result<T, E>, andThenFn: (t: T) => Result<U, E>): Result<U, E> {
    return andThen(andThenFn, this);
  }

  /** Method variant for [`Result.chain`](../modules/_result_.html#chain) */
  chain<U>(this: Result<T, E>, chainFn: (t: T) => Result<U, E>): Result<U, E> {
    return this.andThen(chainFn);
  }

  /** Method variant for [`Result.flatMap`](../modules/_result_.html#flatmap) */
  flatMap<U>(this: Result<T, E>, flatMapFn: (t: T) => Result<U, E>): Result<U, E> {
    return this.andThen(flatMapFn);
  }

  /** Method variant for [`Result.unsafelyUnwrap`](../modules/_result_.html#unsafelyunwrap) */
  unsafelyUnwrap(): never {
    throw new Error('Tried to `unsafelyUnwrap an Err`');
  }

  /** Method variant for [`Result.unsafelyUnwrapErr`](../modules/_result_.html#unsafelyunwraperr) */
  unsafelyUnwrapErr(): E {
    return this.error;
  }

  /** Method variant for [`Result.unwrapOr`](../modules/_result_.html#unwrapor) */
  unwrapOr(this: Result<T, E>, defaultValue: T): T {
    return unwrapOr(defaultValue, this);
  }

  /** Method variant for [`Result.unwrapOrElse`](../modules/_result_.html#unwraporelse) */
  unwrapOrElse(this: Result<T, E>, elseFn: (error: E) => T): T {
    return unwrapOrElse(elseFn, this);
  }

  /** Method variant for [`Result.toMaybe`](../modules/_result_.html#tomaybe) */
  toMaybe(this: Result<T, E>): Maybe<T> {
    return toMaybe(this);
  }

  /** Method variant for [`Result.toString`](../modules/_result_.html#tostring) */
  toString(this: Result<T, E>): string {
    return toString(this);
  }
}

/**
  Is this `Result` an `Ok` instance?

  In TypeScript, narrows the type from `Result<T, E>` to `Ok<T, E>`.
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T, E> {
  return result.variant === Variant.Ok;
}

/**
  Is this `Result` an `Err` instance?

  In TypeScript, narrows the type from `Result<T, E>` to `Err<T, E>`.
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<T, E> {
  return result.variant === Variant.Err;
}

/**
  Create an instance of `Result.Ok`.

  If you need to create an instance with a specific type (as you do whenever you
  are not constructing immediately for a function return or as an argument to a
  function), you can use a type parameter:

  ```ts
  const yayNumber = Result.ok<number, string>(12);
  ```

  Note: `null` is allowed by the type signature so that so that the function
  may be used to  `throw` on passing `null` rather than constructing a type like
  `Result<null, string>`. `undefined` is allowed as a convenience method for
  constructing a `Result<Unit, E>`.

  ```ts
  const normalResult = Result.ok<number, string>(42);
  const explicitUnit = Result.ok<Unit, string>(Unit);
  const implicitUnit = Result.ok<Unit, string>();
  ```

  In the context of an immediate function return, or an arrow function with a
  single expression value, you do not have to specify the types, so this can be
  quite convenient.

  ```ts
  type SomeData = {
    //...
  };

  const isValid = (data: SomeData): boolean => {
    // true or false...
  }

  const arrowValidate = (data: SomeData): Result<Unit, string> =>
    isValid(data) ? Result.ok() : Result.err('something was wrong!');

  function fnValidate(data: someData): Result<Unit, string> {
    return isValid(data) ? Result.ok() : Result.err('something was wrong');
  }
  ```

  @typeparam T The type of the item contained in the `Result`.
  @param value The value to wrap in a `Result.Ok`.
  @throws      If you pass `null` or `undefined`.
 */
export function ok<T, E>(): Result<Unit, E>;
export function ok<T, E>(value: T): Result<T, E>;
export function ok<T, E>(value?: T): Result<Unit, E> | Result<T, E> {
  return value === undefined ? new Ok(Unit) : new Ok(value);
}

/**
  Create an instance of `Result.Error`.

  If you need to create an instance with a specific type (as you do whenever you
  are not constructing immediately for a function return or as an argument to a
  function), you can use a type parameter:

  ```ts
  const notString = Result.err<number, string>('something went wrong');
  ```

  Note: `null` is allowed by the type signature so that so that the function
  may be used to  `throw` on passing `null` rather than constructing a type like
  `Result<null, string>`. `undefined` is allowed as a convenience method for
  constructing a `Result<Unit, E>`.

  ```ts
  const normalResult = Result.err<number, string>('oh no');
  const explicitUnit = Result.err<number, Unit>(Unit);
  const implicitUnit = Result.err<number, Unit>();
  ```

  In the context of an immediate function return, or an arrow function with a
  single expression value, you do not have to specify the types, so this can be
  quite convenient.

  ```ts
  type SomeData = {
    //...
  };

  const isValid = (data: SomeData): boolean => {
    // true or false...
  }

  const arrowValidate = (data: SomeData): Result<number, Unit> =>
    isValid(data) ? Result.ok(42) : Result.err();

  function fnValidate(data: someData): Result<number, Unit> {
    return isValid(data) ? Result.ok(42) : Result.err();
  }
  ```

  @typeparam T The type of the item contained in the `Result`.
 */
export function err<T, E>(): Result<T, Unit>;
export function err<T, E>(error: E): Result<T, E>;
export function err<T, E>(error?: E): Result<T, Unit> | Result<T, E> {
  return isVoid(error) ? new Err(Unit) : new Err(error);
}

/**
  Map over a `Result` instance: apply the function to the wrapped value if the
  instance is `Ok`, and return the wrapped error value wrapped as a new `Err` of
  the correct type (`Result<U, E>`) if the instance is `Err`.

  `Result.map` works a lot like `Array.prototype.map`, but with one important
  difference. Both `Result` and `Array` are containers for other kinds of items,
  but where `Array.prototype.map` has 0 to _n_ items, a `Result` always has
  exactly one item, which is *either* a success or an error instance.

  Where `Array.prototype.map` will apply the mapping function to every item in
  the array (if there are any), `Result.map` will only apply the mapping
  function to the (single) element if an `Ok` instance, if there is one.

  If you have no items in an array of
  numbers named `foo` and call `foo.map(x => x + 1)`, you'll still some have an
  array with nothing in it. But if you have any items in the array (`[2, 3]`),
  and you call `foo.map(x => x + 1)` on it, you'll get a new array with each of
  those items inside the array "container" transformed (`[3, 4]`).

  With `Result.map`, the `Err` variant is treated *by the `map` function* kind
  of the same way as the empty array case: it's just ignored, and you get back a
  new `Result` that is still just the same `Err` instance. But if you have an
  `Ok` variant, the map function is applied to it, and you get back a new
  `Result` with the value transformed, and still wrapped in an `Ok`.

  #### Examples

  ```ts
  import { ok, err, map, toString } from 'true-myth/result';
  const double = n => n * 2;

  const anOk = ok(12);
  const mappedOk = map(double, anOk);
  console.log(toString(mappedOk)); // Ok(24)

  const anErr = err("nothing here!");
  const mappedErr = map(double, anErr);
  console.log(toString(mappedOk)); // Err(nothing here!)
  ```

  @typeparam T  The type of the value wrapped in an `Ok` instance, and taken as
                the argument to the `mapFn`.
  @typeparam U  The type of the value wrapped in the new `Ok` instance after
                applying `mapFn`, that is, the type returned by `mapFn`.
  @typeparam E  The type of the value wrapped in an `Err` instance.
  @param mapFn  The function to apply the value to if `result` is `Ok`.
  @param result The `Result` instance to map over.
  @returns      A new `Result` with the result of applying `mapFn` to the value
                in an `Ok`, or else the original `Err` value wrapped in the new
                instance.
 */
export function map<T, U, E>(mapFn: (t: T) => U, result: Result<T, E>): Result<U, E>;
export function map<T, U, E>(mapFn: (t: T) => U): (result: Result<T, E>) => Result<U, E>;
export function map<T, U, E>(
  mapFn: (t: T) => U,
  result?: Result<T, E>
): Result<U, E> | ((result: Result<T, E>) => Result<U, E>) {
  const op = (r: Result<T, E>) => (isOk(r) ? ok(mapFn(unwrap(r))) : r) as Result<U, E>;
  return curry1(op, result);
}

/**
  Map over a `Result` instance as in [`map`](#map) and get out the value
  if `result` is an `Ok`, or return a default value if `result` is an `Err`.

  #### Examples

  ```ts
  import { ok, err, mapOr } from 'true-myth/result';

  const length = (s: string) => s.length;

  const anOkString = ok('a string');
  const theStringLength = mapOr(0, anOkString);
  console.log(theStringLength);  // 8

  const anErr = err('uh oh');
  const anErrMapped = mapOr(0, anErr);
  console.log(anErrMapped);  // 0
  ```

  @param orU The default value to use if `result` is an `Err`.
  @param mapFn The function to apply the value to if `result` is an `Ok`.
  @param result The `Result` instance to map over.
 */
export function mapOr<T, U, E>(orU: U, mapFn: (t: T) => U, result: Result<T, E>): U;
export function mapOr<T, U, E>(orU: U, mapFn: (t: T) => U): (result: Result<T, E>) => U;
export function mapOr<T, U, E>(orU: U): (mapFn: (t: T) => U) => (result: Result<T, E>) => U;
export function mapOr<T, U, E>(
  orU: U,
  mapFn?: (t: T) => U,
  result?: Result<T, E>
): U | ((result: Result<T, E>) => U) | ((mapFn: (t: T) => U) => (result: Result<T, E>) => U) {
  function fullOp(fn: (t: T) => U, r: Result<T, E>): U {
    return isOk(r) ? fn(unwrap(r)) : orU;
  }

  function partialOp(fn: (t: T) => U): (maybe: Result<T, E>) => U;
  function partialOp(fn: (t: T) => U, curriedResult: Result<T, E>): U;
  function partialOp(
    fn: (t: T) => U,
    curriedResult?: Result<T, E>
  ): U | ((maybe: Result<T, E>) => U) {
    return curriedResult !== undefined
      ? fullOp(fn, curriedResult)
      : (extraCurriedResult: Result<T, E>) => fullOp(fn, extraCurriedResult);
  }

  return mapFn === undefined
    ? partialOp
    : result === undefined ? partialOp(mapFn) : partialOp(mapFn, result);
}

/**
  Map over a `Result` instance as in [`map`](#map) and get out the value if
  `result` is `Ok`, or apply a function (`orElseFn`) to the value wrapped in
  the `Err` to get a default value.

  Like [`mapOr`](#mapor) but using a function to transform the error into a
  usable value instead of simply using a default value.

  #### Examples

  ```ts
  import { ok, err, mapOrElse } from 'true-myth/result';

  const summarize = (s: string) => `The response was: '${s}'`;
  const getReason = (err: { code: number, reason: string }) => err.reason;

  const okResponse = ok("Things are grand here.");
  const mappedOkAndUnwrapped = mapOrElse(getReason, summarize, okResponse);
  console.log(mappedOkAndUnwrapped);  // The response was: 'Things are grand here.'

  const errResponse = err({ code: 500, reason: 'Nothing at this endpoint!' });
  const mappedErrAndUnwrapped = mapOrElse(getReason, summarize, errResponse);
  console.log(mappedErrAndUnwrapped);  // Nothing at this endpoint!
  ```

  @typeparam T    The type of the wrapped `Ok` value.
  @typeparam U    The type of the resulting value from applying `mapFn` to the
                  `Ok` value or `orElseFn` to the `Err` value.
  @typeparam E    The type of the wrapped `Err` value.
  @param orElseFn The function to apply to the wrapped `Err` value to get a
                  usable value if `result` is an `Err`.
  @param mapFn    The function to apply to the wrapped `Ok` value if `result` is
                  an `Ok`.
  @param result   The `Result` instance to map over.
 */
export function mapOrElse<T, U, E>(
  orElseFn: (err: E) => U,
  mapFn: (t: T) => U,
  result: Result<T, E>
): U;
export function mapOrElse<T, U, E>(
  orElseFn: (err: E) => U,
  mapFn: (t: T) => U
): (result: Result<T, E>) => U;
export function mapOrElse<T, U, E>(
  orElseFn: (err: E) => U
): (mapFn: (t: T) => U) => (result: Result<T, E>) => U;
export function mapOrElse<T, U, E>(
  orElseFn: (err: E) => U,
  mapFn?: (t: T) => U,
  result?: Result<T, E>
): U | ((result: Result<T, E>) => U) | ((mapFn: (t: T) => U) => (result: Result<T, E>) => U) {
  function fullOp(fn: (t: T) => U, r: Result<T, E>) {
    return isOk(r) ? fn(unwrap(r)) : orElseFn(unwrapErr(r));
  }

  function partialOp(fn: (t: T) => U): (maybe: Result<T, E>) => U;
  function partialOp(fn: (t: T) => U, curriedResult: Result<T, E>): U;
  function partialOp(
    fn: (t: T) => U,
    curriedResult?: Result<T, E>
  ): U | ((maybe: Result<T, E>) => U) {
    return curriedResult !== undefined
      ? fullOp(fn, curriedResult)
      : (extraCurriedResult: Result<T, E>) => fullOp(fn, extraCurriedResult);
  }

  return mapFn === undefined
    ? partialOp
    : result === undefined ? partialOp(mapFn) : partialOp(mapFn, result);
}

/**
  Map over a `Result`, exactly as in [`map`](#map), but operating on the value
  wrapped in an `Err` instead of the value wrapped in the `Ok`. This is handy
  for when you need to line up a bunch of different types of errors, or if you
  need an error of one shape to be in a different shape to use somewhere else in
  your codebase.

  #### Examples

  ```ts
  import { ok, err, mapErr, toString } from 'true-myth/result';

  const reason = (err: { code: number, reason: string }) => err.reason;

  const anOk = ok(12);
  const mappedOk = mapErr(reason, anOk);
  console.log(toString(mappedOk));  // Ok(12)

  const anErr = err({ code: 101, reason: 'bad file' });
  const mappedErr = mapErr(reason, anErr);
  console.log(toString(mappedErr));  // Err(bad file)
  ```

  @typeparam T    The type of the value wrapped in the `Ok` of the `Result`.
  @typeparam E    The type of the value wrapped in the `Err` of the `Result`.
  @typeparam F    The type of the value wrapped in the `Err` of a new `Result`,
                  returned by the `mapErrFn`.
  @param mapErrFn The function to apply to the value wrapped in `Err` if `result` is an `Err`.
  @param result   The `Result` instance to map over an error case for.
 */
export function mapErr<T, E, F>(mapErrFn: (e: E) => F, result: Result<T, E>): Result<T, F>;
export function mapErr<T, E, F>(mapErrFn: (e: E) => F): (result: Result<T, E>) => Result<T, F>;
export function mapErr<T, E, F>(
  mapErrFn: (e: E) => F,
  result?: Result<T, E>
): Result<T, F> | ((result: Result<T, E>) => Result<T, F>) {
  const op = (r: Result<T, E>) => (isOk(r) ? r : err(mapErrFn(unwrapErr(r)))) as Result<T, F>;
  return curry1(op, result);
}

/**
  You can think of this like a short-circuiting logical "and" operation on a
  `Result` type. If `result` is `Ok`, then the result is the `andResult`. If
  `result` is `Err`, the result is the `Err`.

  This is useful when you have another `Result` value you want to provide if
  and *only if* you have an `Ok` – that is, when you need to make sure that if you
  `Err`, whatever else you're handing a `Result` to *also* gets that `Err`.

  Notice that, unlike in [`map`](#map) or its variants, the original `result` is
  not involved in constructing the new `Result`.

  #### Examples

  ```ts
  import { and, ok, err, toString } from 'true-myth/result';

  const okA = ok('A');
  const okB = ok('B');
  const anErr = err({ so: 'bad' });

  console.log(toString(and(okB, okA)));  // Ok(B)
  console.log(toString(and(okB, anErr)));  // Err([object Object])
  console.log(toString(and(anErr, okA)));  // Err([object Object])
  console.log(toString(and(anErr, anErr)));  // Err([object Object])
  ```

  @typeparam T     The type of the value wrapped in the `Ok` of the `Result`.
  @typeparam U     The type of the value wrapped in the `Ok` of the `andResult`,
                   i.e. the success type of the `Result` present if the checked
                   `Result` is `Ok`.
  @typeparam E     The type of the value wrapped in the `Err` of the `Result`.
  @param andResult The `Result` instance to return if `result` is `Err`.
  @param result    The `Result` instance to check.
 */
export function and<T, U, E>(andResult: Result<U, E>, result: Result<T, E>): Result<U, E>;
export function and<T, U, E>(andResult: Result<U, E>): (result: Result<T, E>) => Result<U, E>;
export function and<T, U, E>(
  andResult: Result<U, E>,
  result?: Result<T, E>
): Result<U, E> | ((result: Result<T, E>) => Result<U, E>) {
  const op = (r: Result<T, E>) => (isOk(r) ? andResult : r as Err<any, E>);
  return curry1(op, result);
}

/**
  Apply a function to the wrapped value if `Ok` and return a new `Ok`
  containing the resulting value; or if it is `Err` return it unmodified.

  This differs from `map` in that `thenFn` returns another `Result`. You can use
  `andThen` to combine two functions which *both* create a `Result` from an
  unwrapped type.

  You may find the `.then` method on an ES6 `Promise` helpful for comparison: if
  you have a `Promise`, you can pass its `then` method a callback which
  returns another `Promise`, and the result will not be a *nested* promise, but
  a single `Promise`. The difference is that `Promise#then` unwraps *all*
  layers to only ever return a single `Promise` value, whereas `Result.andThen`
  will not unwrap nested `Result`s.

  This is also commonly known as (and therefore aliased as) [`flatMap`] or
  [`chain`]. It is sometimes also known as `bind`, but *not* aliased as such
  because [`bind` already means something in JavaScript][bind].

  [`flatMap`]: #flatmap
  [`chain`]: #chain
  [bind]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

  #### Examples

  ```ts
  import { ok, err, andThen, toString } from 'true-myth/result';

  const toLengthAsResult = (s: string) => ok(s.length);

  const anOk = ok('just a string');
  const lengthAsResult = andThen(toLengthAsResult, anOk);
  console.log(toString(lengthAsResult));  // Ok(13)

  const anErr = err(['srsly', 'whatever']);
  const notLengthAsResult = andThen(toLengthAsResult, anErr);
  console.log(toString(notLengthAsResult));  // Err(srsly,whatever)
  ```

  @typeparam T   The type of the value wrapped in the `Ok` of the `Result`.
  @typeparam U   The type of the value wrapped in the `Ok` of the `Result`
                 returned by the `thenFn`.
  @typeparam E   The type of the value wrapped in the `Err` of the `Result`.
  @param thenFn  The function to apply to the wrapped `T` if `maybe` is `Just`.
  @param result  The `Maybe` to evaluate and possibly apply a function to.
 */
export function andThen<T, U, E>(
  thenFn: (t: T) => Result<U, E>,
  result: Result<T, E>
): Result<U, E>;
export function andThen<T, U, E>(
  thenFn: (t: T) => Result<U, E>
): (result: Result<T, E>) => Result<U, E>;
export function andThen<T, U, E>(
  thenFn: (t: T) => Result<U, E>,
  result?: Result<T, E>
): Result<U, E> | ((result: Result<T, E>) => Result<U, E>) {
  const op = (r: Result<T, E>) => (isOk(r) ? thenFn(unwrap(r)) : r as Err<any, E>);
  return curry1(op, result);
}

/** Alias for [`andThen`](#andthen). */
export const chain = andThen;

/** Alias for [`andThen`](#andthen). */
export const flatMap = andThen;

/**
  Provide a fallback for a given `Result`. Behaves like a logical `or`: if the
  `result` value is an `Ok`, returns that `result`; otherwise, returns the
  `defaultResult` value.

  This is useful when you want to make sure that something which takes a
  `Result` always ends up getting an `Ok` variant, by supplying a default value
  for the case that you currently have an `Err`.

  ```ts
  import { ok, err, Result, or } from 'true-utils/result';

  const okA = ok<string, string>('a');
  const okB = ok<string, string>('b');
  const anErr = err<string, string>(':wat:');
  const anotherErr = err<string, string>(':headdesk:');

  console.log(or(okB, okA).toString());  // Ok(A)
  console.log(or(anErr, okA).toString());  // Ok(A)
  console.log(or(okB, anErr).toString());  // Ok(B)
  console.log(or(anotherErr, anErr).toString());  // Err(:headdesk:)
  ```

  @typeparam T          The type wrapped in the `Ok` case of `result`.
  @typeparam E          The type wrapped in the `Err` case of `result`.
  @typeparam F          The type wrapped in the `Err` case of `defaultResult`.
  @param defaultResult  The `Result` to use if `result` is an `Err`.
  @param result         The `Result` instance to check.
  @returns              `result` if it is an `Ok`, otherwise `defaultResult`.
 */
export function or<T, E, F>(defaultResult: Result<T, F>, result: Result<T, E>): Result<T, F>;
export function or<T, E, F>(defaultResult: Result<T, F>): (result: Result<T, E>) => Result<T, F>;
export function or<T, E, F>(
  defaultResult: Result<T, F>,
  result?: Result<T, E>
): Result<T, F> | ((result: Result<T, E>) => Result<T, F>) {
  const op = (r: Result<T, E>) => (isOk(r) ? r as Ok<T, any> : defaultResult);
  return curry1(op, result);
}

/**
  Like `or`, but using a function to construct the alternative `Result`.

  Sometimes you need to perform an operation using other data in the environment
  to construct the fallback value. In these situations, you can pass a function
  (which may be a closure) as the `elseFn` to generate the fallback `Result<T>`.
  It can then transform the data in the `Err` to something usable as an `Ok`, or
  generate a new `Err` instance as appropriate.

  Useful for transforming failures to usable data.

  @param elseFn The function to apply to the contents of the `Err` if `result`
                is an `Err`, to create a new `Result`.
  @param result The `Result` to use if it is an `Ok`.
  @returns      The `result` if it is `Ok`, or the `Result` returned by `elseFn`
                if `result` is an `Err.
 */
export function orElse<T, E, F>(
  elseFn: (err: E) => Result<T, F>,
  result: Result<T, E>
): Result<T, F>;
export function orElse<T, E, F>(
  elseFn: (err: E) => Result<T, F>
): (result: Result<T, E>) => Result<T, F>;
export function orElse<T, E, F>(
  elseFn: (err: E) => Result<T, F>,
  result?: Result<T, E>
): Result<T, F> | ((result: Result<T, E>) => Result<T, F>) {
  const op = (r: Result<T, E>) => (isOk(r) ? r as Ok<T, any> : elseFn(r.unsafelyUnwrapErr()));
  return curry1(op, result);
}

/**
  Get the value out of the `Result`.

  Returns the content of an `Ok`, but **throws if the `Result` is `Err`.**
  Prefer to use [`unwrapOr`](#unwrapor) or [`unwrapOrElse`](#unwraporelse).

  @throws If the `Result` instance is `Nothing`.
 */
export function unsafelyUnwrap<T, E>(result: Result<T, E>): T {
  return result.unsafelyUnwrap();
}

/** Alias for [`unsafelyUnwrap`](#unsafelyunwrap) */
export const unsafelyGet = unsafelyUnwrap;

/** Alias for [`unsafelyUnwrap`](#unsafelyunwrap) */
export const unsafeGet = unsafelyUnwrap;

// For internal use; but not exported because we want to emphasize that this is
// a bad idea via the name.
const unwrap = unsafelyUnwrap;

/**
  Get the error value out of the [`Result`](#result).

  Returns the content of an `Err`, but **throws if the `Result` is `Ok`**.
  Prefer to use [`unwrapOrElse`](#unwraporelse).

  @param result
  @throws Error If the `Result` instance is `Nothing`.
 */
export function unsafelyUnwrapErr<T, E>(result: Result<T, E>): E {
  return result.unsafelyUnwrapErr();
}

/** Alias for [`unsafelyUnwrapErr`](#unsafelyunwraperr) */
export const unsafelyGetErr = unsafelyUnwrapErr;

// For internal use; but not exported because we want to emphasize that this is
// a bad idea via the name.
const unwrapErr = unsafelyUnwrapErr;

/**
  Safely get the value out of the `Ok` variant of a [`Result`](#result).

  This is the recommended way to get a value out of a `Result` most of the time.

  ```ts
  import { ok, err, unwrapOr } from 'true-myth/result';

  const anOk = ok<number, string>(12);
  console.log(unwrapOr(0, anOk));  // 12

  const anErr = err<number, string>('nooooo');
  console.log(unwrapOr(0, anErr));  // 0
  ```

  @typeparam T        The value wrapped in the `Ok`.
  @typeparam E        The value wrapped in the `Err`.
  @param defaultValue The value to use if `result` is an `Err`.
  @param result       The `Result` instance to unwrap if it is an `Ok`.
  @returns            The content of `result` if it is an `Ok`, otherwise
                      `defaultValue`.
 */
export function unwrapOr<T, E>(defaultValue: T, result: Result<T, E>): T;
export function unwrapOr<T, E>(defaultValue: T): (result: Result<T, E>) => T;
export function unwrapOr<T, E>(
  defaultValue: T,
  result?: Result<T, E>
): T | ((result: Result<T, E>) => T) {
  const op = (r: Result<T, E>) => (isOk(r) ? unwrap(r) : defaultValue);
  return curry1(op, result);
}

/** Alias for [`unwrapOr`](#unwrapor) */
export const getOr = unwrapOr;

/**
  Safely get the value out of a [`Result`](#result) by returning the wrapped
  value if it is `Ok`, or by applying `orElseFn` to the value in the `Err`.

  This is useful when you need to *generate* a value (e.g. by using current
  values in the environment – whether preloaded or by local closure) instead of
  having a single default value available (as in [`unwrapOr`](#unwrapor)).

  ```ts
  import { ok, err, unwrapOrElse } from 'true-myth/result';

  // You can imagine that someOtherValue might be dynamic.
  const someOtherValue = 2;
  const handleErr = (errValue: string) => errValue.length + someOtherValue;

  const anOk = ok<number, string>(42);
  console.log(unwrapOrElse(handleErr, anOk));  // 42

  const anErr = err<number, string>('oh teh noes');
  console.log(unwrapOrElse(handleErr, anErr));  // 13
  ```

  @typeparam T    The value wrapped in the `Ok`.
  @typeparam E    The value wrapped in the `Err`.
  @param orElseFn A function applied to the value wrapped in `result` if it is
                  an `Err`, to generate the final value.
  @param result   The `result` to unwrap if it is an `Ok`.
  @returns        The value wrapped in `result` if it is `Ok` or the value
                  returned by `orElseFn` applied to the value in `Err`.
 */
export function unwrapOrElse<T, E>(orElseFn: (error: E) => T, result: Result<T, E>): T;
export function unwrapOrElse<T, E>(orElseFn: (error: E) => T): (result: Result<T, E>) => T;
export function unwrapOrElse<T, E>(
  orElseFn: (error: E) => T,
  result?: Result<T, E>
): T | ((result: Result<T, E>) => T) {
  const op = (r: Result<T, E>) => (isOk(r) ? unwrap(r) : orElseFn(unwrapErr(r)));
  return curry1(op, result);
}

/** Alias for [`unwrapOrElse`](#unwraporelse) */
export const getOrElse = unwrapOrElse;

/**
  Convert a [`Result`](#result) to a [`Maybe`](../modules/_maybe_.html#maybe).

  The converted type will be [`Just`] if the `Result` is [`Ok`] or [`Nothing`]
  if the `Result` is [`Err`]; the wrapped error value will be discarded.

  [`Just`]: ../classes/_maybe_.just.html
  [`Nothing`]: ../classes/_maybe_.nothing.html
  [`Ok`]: ../classes/_result_.ok.html
  [`Err`]: ../classes/_result_.err.html

  @param result The `Result` to convert to a `Maybe`
  @returns      `Just` the value in `result` if it is `Ok`; otherwise `Nothing`
 */
export function toMaybe<T, E>(result: Result<T, E>): Maybe<T> {
  return isOk(result) ? just(unwrap(result)) : nothing();
}

/**
  Transform a [`Maybe`](../modules/_maybe_.html#maybe) into a [`Result`](#result).

  If the `Maybe` is a [`Just`], its value will be wrapped in the [`Ok`] variant;
  if it is a [`Nothing`] the `errValue` will be wrapped in the [`Err`] variant.

  [`Just`]: ../classes/_maybe_.just.html
  [`Nothing`]: ../classes/_maybe_.nothing.html
  [`Ok`]: ../classes/_result_.ok.html
  [`Err`]: ../classes/_result_.err.html

  @param errValue A value to wrap in an `Err` if `maybe` is a `Nothing`.
  @param maybe    The `Maybe` to convert to a `Result`.
 */
export function fromMaybe<T, E>(errValue: E, maybe: Maybe<T>): Result<T, E>;
export function fromMaybe<T, E>(errValue: E): (maybe: Maybe<T>) => Result<T, E>;
export function fromMaybe<T, E>(
  errValue: E,
  maybe?: Maybe<T>
): Result<T, E> | ((maybe: Maybe<T>) => Result<T, E>) {
  const op = (m: Maybe<T>) => (isJust(m) ? ok<T, E>(Maybe.unsafelyUnwrap(m)) : err<T, E>(errValue));
  return curry1(op, maybe);
}

/**
  Create a `String` representation of a `result` instance.

  An `Ok` instance will be printed as `Ok(<representation of the value>)`, and
  an `Err` instance will be printed as `Err(<representation of the error>)`,
  where the representation of the value or error is simply the value or error's
  own `toString` representation. For example:

  call                              | output
  ----------------------------------|------------------------
  `toString(ok(42))`                | `Ok(42)`
  `toString(ok([1, 2, 3]))`         | `Ok(1,2,3)`
  `toString(ok({ an: 'object' }))`  | `Ok([object Object])`n
  `toString(err(42))`               | `Err(42)`
  `toString(err([1, 2, 3]))`        | `Err(1,2,3)`
  `toString(err({ an: 'object' }))` | `Err([object Object])`

  @typeparam T The type of the wrapped value; its own `.toString` will be used
               to print the interior contents of the `Just` variant.
  @param maybe The value to convert to a string.
  @returns     The string representation of the `Maybe`.
 */
export function toString<T, E>(result: Result<T, E>): string {
  const body = (isOk(result) ? unwrap(result) : unwrapErr(result)).toString();
  return `${result.variant}(${body})`;
}

/** A lightweight object defining how to handle each variant of a Maybe. */
export type Matcher<T, E, A> = {
  Ok: (value: T) => A;
  Err: (error: E) => A;
};

/**
  Performs the same basic functionality as `getOrElse`, but instead of simply
  unwrapping the value if it is `Ok` and applying a value to generate the same
  default type if it is `Nothing`, lets you supply functions which may transform
  the wrapped type if it is `Ok` or get a default value for `Nothing`.

  This is kind of like a poor man's version of pattern matching, which
  JavaScript currently lacks.

  Instead of code like this:

  ```ts
  import { Result, isOk, match } from 'true-myth/maybe';

  const logValue = (mightBeANumber: Result<number, string>) => {
    console.log(
      isOk(mightBeANumber)
        ? unsafelyUnwrap(mightBeANumber).toString()
        : `There was an error: ${unsafelyGetErr(mightBeANumber)}`
    );
  };
  ```

  ...we can write code like this:

  ```ts
  import { Result, match } from 'true-myth/maybe';

  const logValue = (mightBeANumber: Result<number, string>) => {
    const value = match(
      {
        Ok: n => n.toString(),
        Err: e => `There was an error: ${e}`,
      },
      mightBeANumber
    );
    console.log(value);
  };
  ```

  This is slightly longer to write, but clearer: the more complex the resulting
  expression, the hairer it is to understand the ternary. Thus, this is
  especially convenient for times when there is a complex result, e.g. when
  rendering part of a React component inline in JSX/TSX.

  @param matcher A lightweight object defining what to do in the case of each
                 variant.
  @param maybe   The `maybe` instance to check.
 */
export function match<T, E, A>(matcher: Matcher<T, E, A>, result: Result<T, E>): A;
export function match<T, E, A>(matcher: Matcher<T, E, A>): (result: Result<T, E>) => A;
export function match<T, E, A>(
  matcher: Matcher<T, E, A>,
  result?: Result<T, E>
): A | ((result: Result<T, E>) => A) {
  const op = (r: Result<T, E>) => mapOrElse(matcher.Err, matcher.Ok, r);
  return curry1(op, result);
}

/** Alias for [`match`](#match) */
export const cata = match;

/**
  A value which may (`Ok`) or may not (`Err`) be present.

  The behavior of this type is checked by TypeScript at compile time, and bears
  no runtime overhead other than the very small cost of the container object.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;
export const Result = {
  Variant,
  Ok,
  Err,
  isOk,
  isErr,
  ok,
  err,
  map,
  mapOr,
  mapOrElse,
  mapErr,
  and,
  andThen,
  chain,
  flatMap,
  or,
  orElse,
  unsafelyUnwrap,
  unsafelyGet,
  unsafeGet,
  unsafelyUnwrapErr,
  unsafelyGetErr,
  unwrapOr,
  getOr,
  unwrapOrElse,
  getOrElse,
  toMaybe,
  fromMaybe,
  toString,
  match,
  cata,
};

export default Result;
