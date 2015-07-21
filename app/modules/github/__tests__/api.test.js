describe('modules/github/api', function () {
    var PullRequest = require('app/modules/models').get('PullRequest');
    var proxyquire = require('proxyquire');
    var api, githubStub, authStub;

    beforeEach(function () {
        authStub = sinon.stub();
        githubStub = sinon.stub().returns({
            authenticate: authStub
        });

        api = proxyquire('../api', {
            'github': githubStub
        });
    });

    describe('#init', function () {
        it('should invoke github module with passed options', function () {
            var options = {
                test: 1,
                authenticate: {
                    type: 'oauth',
                    token: 'my_tokem'
                },
                content: {}
            };

            api.init(options);

            assert.calledWith(githubStub, options);
            assert.calledWith(authStub, options.authenticate);
        });
    });

    describe('#setBodyContent', function () {
        var pullRequest;

        beforeEach(function (done) {
            new PullRequest(require('app/modules/models/__tests__/mocks/pull_request.json'))
                .save()
                .then(function (pr) {
                    pullRequest = pr;
                    done();
                });

            sinon.stub(api, '_updatePullRequestBody');
        });

        afterEach(function (done) {
            api._updatePullRequestBody.restore();
            PullRequest.remove({}, done);
        });

        it('should throw an error if pull request not found', function () {
            return assert.isRejected(
                api.setBodyContent(123123123, 'test:content', 'test content for pull request body')
            );
        });

        it('should set extra body content', function (done) {
            api.setBodyContent(pullRequest._id, 'test:content', 'test content for pull request body')
                .then(function (updatedPull) {
                    assert.equal(updatedPull.extra_body['test:content'], 'test content for pull request body');
                    assert.called(api._updatePullRequestBody);
                    done();
                });
        });
    });

    describe('#getPullRequestFiles', function () {
        beforeEach(function () {
            api.api = { pullRequests: {} };
        });

        it('should reject with error if api responses with error', function () {
            api.api.pullRequests.getFiles = function (params, cb) { cb('error'); };

            return assert.isRejected(api.getPullRequestFiles({}));
        });

        it('should fulfil with pull request files', function () {
            var result = [{ patch: '' }, { patch: '' }, { patch: '' }];

            api.api.pullRequests.getFiles = function (params, cb) { cb(null, result); };

            return assert.becomes(api.getPullRequestFiles({}), result);
        });
    });
});