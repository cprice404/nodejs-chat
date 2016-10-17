'use strict'

const expect = require('chai').expect

const MessageQueue = require('../../lib/message_queue')

function mock_logger() {
    var logger = new Object();
    logger.debug = function(msg) {}
    return logger;
}

function range(n) {
    return Array(n).fill().map((_,i) => i)
}

describe('MessageQueue', function() {
    it('should throw an error if no logger is passed to the constructor', function() {
        expect(() => { new MessageQueue.MessageQueue() }).to.throw(Error, /Missing required argument/)
    })

    var logger = mock_logger()
    var mq = new MessageQueue.MessageQueue(logger)
    describe('#latestMessages()', function() {
        it('should initially be empty', function() {
            expect(mq.latestMessages().length).to.eql(0)
        })
        it('should grow as messages are added', function() {
            expect([1, 2, 3]).to.eql([1,2,3])
            for (let i = 1; i <= MessageQueue.MAX_MESSAGES; i++) {
                var message = new MessageQueue.Message(
                    "server_id", "message", "user", "foo" + i, Date.now()
                )
                mq.submit(message)
                expect(mq.latestMessages().length).to.eql(i)
                expect(mq.latestMessages().map((m) => m.message)).to.eql(range(i).map((i) => "foo" + (i + 1)))
            }
        })
        it('should drop messages after max size is reached', function() {
            var message = new MessageQueue.Message(
                "server_id", "message", "user", "bar!", Date.now()
            )
            mq.submit(message)
            expect(mq.latestMessages().length).to.eql(MessageQueue.MAX_MESSAGES)
            var expected = range(MessageQueue.MAX_MESSAGES - 1).map((i) => "foo" + (i + 2))
            expected.push("bar!")
            expect(mq.latestMessages().map((m) => m.message)).to.eql(expected)

            var message = new MessageQueue.Message(
                "server_id", "message", "user", "baz!", Date.now()
            )
            mq.submit(message)
            expect(mq.latestMessages().length).to.eql(MessageQueue.MAX_MESSAGES)
            expected.shift()
            expected.push("baz!")
            expect(mq.latestMessages().map((m) => m.message)).to.eql(expected)
        })

    })
})