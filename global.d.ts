declare global {
  var mongoose: {
    conn: Promise<Mongoose> | null;
    promise: Promise<Mongoose> | null;
  };
}

export {};
