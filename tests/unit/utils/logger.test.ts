import { Log } from '../../../src/utils/logger'
import Colors from 'colors/safe';

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
        console.dir = jest.fn();
        console.error = jest.fn();
    })
    it('logs info', () => {
        Log.info('hello', 'world');

        expect(console.log).toHaveBeenCalledWith(Colors.blue("Info: world "))
        expect(console.dir).toHaveBeenCalledWith('hello')
    })
    it('logs warning', () => {
        Log.warning('hello', 'world');

        expect(console.log).toHaveBeenCalledWith(Colors.yellow("Warning: world "))
        expect(console.dir).toHaveBeenCalledWith('hello')
    })
    it('logs error with error payload', () => {
        Log.error(new Error('hello'), 'world');

        expect(console.log).toHaveBeenCalledWith(Colors.red("Error: world "))
        expect(console.error).toHaveBeenCalledWith(new Error('hello'))
    })

})