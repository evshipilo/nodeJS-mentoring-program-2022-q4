process.stdin.on('data', (data: Buffer): void => {
  const output: string = data.toString().split('').reverse().join('');
  process.stdout.moveCursor(0, -1);
  process.stdout.write(output + '\n' + '\n');
});
