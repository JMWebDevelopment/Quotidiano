jQuery(document).foundation();
/* 
These functions make sure WordPress 
and Foundation play nice together.
*/

jQuery(document).ready(function() {
    
    // Remove empty P tags created by WP inside of Accordion and Orbit
    jQuery('.accordion p:empty, .orbit p:empty').remove();
    
	 // Makes sure last grid item floats left
	jQuery('.archive-grid .columns').last().addClass( 'end' );
	
	// Adds Flex Video to YouTube and Vimeo Embeds
	jQuery('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').wrap("<div class='flex-video'/>");

	jQuery( 'a' ).click( function() {
	    console.log('linked clicked');
		jQuery('html, body').animate({
			scrollTop: jQuery("html").offset().top
		}, 500);
	});

    jQuery( document.body ).on( 'click', 'a',  function() {
        console.log('linked clicked');
        jQuery('html, body').animate({
            scrollTop: jQuery("html").offset().top
        }, 500);
    });

});
function changeCurrentNavItem() {
	jQuery(function () {
		var currentItem = '';
		jQuery("#theme-slug-top-menu ul li").each(function () {
			if (jQuery(this).hasClass("current-item")) {
				currentItem = jQuery(this);
			}
		});
		var pgurl = window.location.href;
		var found = false;
		jQuery("#theme-slug-top-menu ul li").each(function () {
			if (jQuery(this).find("a").attr("href") == pgurl || jQuery(this).find("a").attr("href") == '') {
				if (currentItem != '') {
					currentItem.removeClass('current-item');
				}
				jQuery(this).addClass("current-item");
				currentItem = jQuery(this);
				found = true;
			}
			if (found == false) {
				if (currentItem != '') {
					currentItem.removeClass('current-item');
				}
			}
		});
	});
}
changeCurrentNavItem();

function replyToComment( commentParentId ) {
	commentParentId = commentParentId.split("-").pop();
	jQuery( '#parent' ).val( commentParentId );
	var replyTo = jQuery( '#comment-' + commentParentId + ' .comment-name' ).html();
	jQuery('.add-comment').html( quotidiano.translations.replying_to + replyTo + '  <span onclick="removeReply()">' + quotidiano.translations.remove_reply + '</span>' );
	jQuery('html, body').animate({
		scrollTop: jQuery(".post-comments").offset().top
	}, 500);
}
function removeReply() {
	jQuery( '#parent' ).val('0');
	jQuery('.add-comment').html( quotidiano.translations.add_comment );
}

function getArchiveUrl( archiveType, endpoints, page  ) {
	var url = '';
	var pagedUrl = '';
	if ( archiveType == 'Author' ) {
        url = quotidiano.api_url + 'users?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'author/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Category' ) {
        url = quotidiano.api_url + 'categories?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'category/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Search' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?search=' + endpoints[0] + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?search=' + endpoints[0];
        }
        pagedUrl = quotidiano.site_url + 'search/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Tag' ) {
        url = quotidiano.api_url + 'tags?slug=' + endpoints[0];
        pagedUrl = quotidiano.site_url + 'tag/' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Year' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/page/';
    } else if ( archiveType == 'Month' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0] + '&monthnum=' + endpoints[1];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/' + endpoints[1] + '/page/';
    } else if ( archiveType == 'Day' ) {
        url = quotidiano.api_url + 'posts?year=' + endpoints[0] + '&monthnum=' + endpoints[1] + '&day=' + endpoints[2];
        pagedUrl = quotidiano.site_url + '' + endpoints[0] + '/' + endpoints[1] + '/' + endpoints[2] + '/page/';
    }
    return [url, pagedUrl];
}

function getArchivePosts( archiveType, page, endpoint, endpointId ) {
	var url = '';
    if ( archiveType == 'Category' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?categories=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?categories=' + endpointId;
        }
    } else if ( archiveType == 'Tag' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?tags=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?tags=' + endpointId;
        }
    } else if ( archiveType == 'Author' ) {
        if ( page > 1 ) {
            url = quotidiano.api_url + 'posts?author=' + endpointId + '&page=' + page;
        } else {
            url = quotidiano.api_url + 'posts?author=' + endpointId;
        }
	}

    return url;
}

function getMonthName( month ) {
	month = month - 1;
	return quotidiano.months[month];
}

function showSiteTitle( home ) {
    if ( home == false ) {
        jQuery('.site-title').show();
    } else {
        jQuery('.site-title').hide();
    }
}

(function() {
	angular.module('myapp', ['ui.router', 'ngResource', 'ngSanitize'])
        .filter('trustAsHtml', function($sce) {
            return function(html) {
                return $sce.trustAsHtml(html);
            };
        })
		.factory('Comments',function($resource){
			return $resource(quotidiano.api_url+':ID/comments',{
				ID:'@id'
			},{
				'update':{method:'PUT'},
				'save':{
					method:'POST'
					/*headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': quotidiano.nonce
					}*/
				}
			});
		})
        .service('homePosts', ['$http', function ($http) {
            this.getHomePosts = function ( currentYear, currentMonth ) {
            	if ( currentYear == '' || currentMonth == '' ) {
                    var promise = $http({
                        method: 'GET',
                        url: quotidiano.api_url + 'posts?per_page=1'
                    })
                        .then(function (res, status, headers, config) {
                            return res;
                        })
				} else {
                    var promise = $http({
                        method: 'GET',
                        url: quotidiano.api_url + 'posts?year=' + currentYear + '&monthnum=' + currentMonth + '&per_page=31'
                    })
                        .then(function (res, status, headers, config) {
                            return res;
                        })
                }
                return promise;
            }
        }])
        .service('SortComments', function () {
            this.getCommentById = function ( commentID, comments_list ) {
                for ( j = 0; j < comments_list.length; j++ ) {
                    if ( comments_list[j].comment_ID == commentID ) {
                        return comments_list[j];
                    }
                }
            }
            this.getCommentDepth = function ( theComment, comments_list ) {
                var depthLevel = 0;
                while ( theComment.comment_parent > 0 ) {
                    theComment = this.getCommentById( theComment.comment_parent, comments_list );
                    depthLevel++;
                }
                return depthLevel;
            }
            this.arrangeComments = function ( commentsList ) {
                var maxDepth = 0;
                for ( i = commentsList.length - 1; i >= 0; i-- ) {
                    if ( commentsList[i].comment_approved != 1 ) {
                        commentsList.splice( i, 1 );
                    }
                }
                for ( i = 0; i < commentsList.length; i += 1 ) {
                    commentsList[i].comment_children = [];
                    var date = commentsList[i].comment_date.split(" ").join("T").concat("Z");
                    commentsList[i].comment_date = new Date(date);
                    commentsList[i].comment_depth = this.getCommentDepth( commentsList[i], commentsList );
                    if ( this.getCommentDepth( commentsList[i], commentsList ) > maxDepth ) {
                        maxDepth = this.getCommentDepth( commentsList[i], commentsList );
                    }
                }
                for ( i = maxDepth; i > 0; i-- ) {
                    for ( j = 0; j < commentsList.length; j++ ) {
                        if ( commentsList[j].comment_depth == i ) {
                            for ( k = 0; k < commentsList.length; k++ ) {
                                if ( commentsList[j].comment_parent == commentsList[k].comment_ID ) {
                                    commentsList[k].comment_children.push( commentsList[j] )
                                }
                            }
                        }
                    }
                }
                for ( i = commentsList.length - 1; i >= 0; i-- ) {
                    if ( commentsList[i].comment_parent > 0 ) {
                        commentsList.splice( i, 1 );
                    }
                }

                return commentsList;
            }
        })
		.controller('Home', ['$scope', '$http', '$stateParams', 'homePosts', function ($scope, $http, $stateParams, homePosts) {
			$scope.translations = quotidiano.translations;
			$scope.isLoaded = false;
			$scope.isMoreLoaded = true;
            var loadedPosts = [];
            jQuery('.page-home-header').show();
            jQuery('.social-media').show();
            showSiteTitle(true);
            $scope.viewLoading = true;
            homePosts.getHomePosts( '', '' ).then( function( promise ) {
            	var post = promise.data[0];
            	var date = new Date( post.date );
            	var month = date.getMonth() + 1;
            	if ( month < 10 ) {
                    month = '0' + month;
                }
            	var year = date.getFullYear();
            	var loadedPosts = [];
                homePosts.getHomePosts( year, month ).then( function( promise ) {
					$scope.posts = promise.data;
                    month = getMonthName( month );
                    $scope.month_section_title = month + ' ' + year;
                    document.querySelector('title').innerHTML = quotidiano.site_title + ' | ' + quotidiano.site_description;
                    changeCurrentNavItem();
                    for ( i = 0; i < $scope.posts.length; i++ ) {
                    	loadedPosts.push( $scope.posts[i].id );
					}
                    $scope.viewLoading = false;
                    $scope.isLoaded = true;
				});
			});
		}])
		.controller('SinglePost', ['$scope', '$sce', '$http', '$stateParams', 'Comments', 'SortComments', function ($scope, $sce, $http, $stateParams, Comments, SortComments) {
            $scope.translations = quotidiano.translations;
            $scope.isMoreLoaded = true;
            $scope.isLoaded = false;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
            showSiteTitle(false);
			$http.get(quotidiano.api_url + 'posts?slug=' + $stateParams.slug + '&_embed').then(function(res){
                var data = res.data;
                console.log(data);
			    if ( data.length > 0 ) {
                    $scope.post = data[0];
                    $scope.post.comments = SortComments.arrangeComments($scope.post.comments);
                    $scope.numComments = $scope.post.comments.length;
                    $scope.loggedIn = quotidiano.logged_in;
                    $scope.social_links = quotidiano.social_media_links;
                    if ($scope.loggedIn == true) {
                        $scope.currentUser = quotidiano.logged_in_user;
                    }
                    document.querySelector('title').innerHTML = $scope.post.title.rendered + ' | ' + quotidiano.site_title;
                    changeCurrentNavItem();
                    $scope.isLoaded = true;
                } else {
                    $scope.is404 = true;
                    $scope.header_image = quotidiano.header_image;
                    $scope.isLoaded = true;
                }
			}, function( res, status ){
                if ( status == 404 ) {
                    $scope.is404 = true;
                    $scope.header_image = quotidiano.header_image;
                    $scope.isLoaded = true;
                }
            });
			$scope.savecomment = function(){
				$scope.openComment = {};
				$scope.openComment.author_name = jQuery('#name').val();
				$scope.openComment.author_email = jQuery('#email').val();
				$scope.openComment.parent = jQuery('#parent').val();
				$scope.openComment.content = $sce.trustAsHtml( jQuery('#comment-content').val() );
                $scope.openComment.post = jQuery('.single-view').attr('id').replace('post-', '');
                console.log( $scope.openComment.content );
                $http({
                    method: 'POST',
                    url: '/wp-json/wp/v2/comments',
                    params: $scope.openComment,
                    headers: { 'Content-Type': 'multipart/form-data', 'X-WP-Nonce': quotidiano.nonce }
                })
                    .then(function (result) {
                        $scope.openComment = {};
                        $scope.openComment.post = $scope.post.id;
                        jQuery('#comment-content').val('');
                        if ( $scope.loggedIn == false ) {
                            jQuery('#name').val('');
                            jQuery('#email').val('');
                        }
                        jQuery('#comment-form').hide(500, function() {
                            jQuery('.comment-success').show(400);
                        });
                    });
			}
		}])
		.controller('Page', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            $scope.isLoaded = false;
            $scope.isMoreLoaded = true;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
            showSiteTitle(false);
			$http.get( quotidiano.api_url + 'pages?slug=' + $stateParams.slug ).then(function(res){
			    var data = res.data;
			    if ( data.length > 0 ) {
                    $scope.post = data[0];
                    $scope.social_links = quotidiano.social_media_links;
                    $scope.isLoaded = true;
                    document.querySelector('title').innerHTML = res[0].title.rendered + ' | ' + quotidiano.site_title
                    changeCurrentNavItem();
                } else {
                    $scope.is404 = true;
                    $scope.header_image = quotidiano.header_image;
                    $scope.isLoaded = true;
                }
			}, function( res, status ){
			    if ( status == 404 ) {
			        $scope.is404 = true;
                    $scope.header_image = quotidiano.header_image;
                    $scope.isLoaded = true;
                }
            });
		}])
		.controller('Archive', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            $scope.isLoaded = false;
            $scope.isMoreLoaded = true;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
            showSiteTitle(false);
            $scope.social_links = quotidiano.social_media_links;
			var url = '';
			var pagedUrl = '';
			if ( $stateParams.archiveType == 'Day' || $stateParams.archiveType == 'Month' ) {
				var endpoints = [];
				if ( $stateParams.archiveType == 'Day' ) {
                    $scope.endpoints = [ $stateParams.year, $stateParams.month, $stateParams.endpoint ];
				} else {
                    $scope.endpoints = [ $stateParams.year, $stateParams.endpoint ];
				}
			} else {
                $scope.endpoints = [ $stateParams.endpoint ];
			}
			$scope.header_image = quotidiano.header_image;
			var urls = getArchiveUrl( $stateParams.archiveType, $scope.endpoints, $stateParams.page  );
			url = urls[0];
			pagedUrl = urls[1];
			if ( $stateParams.archiveType != 'Search' && $stateParams.archiveType != 'Year' && $stateParams.archiveType != 'Month' && $stateParams.archiveType != 'Day' ) {
				$http.get(url).then(function (res) {
				    var data = res.data;
					if( data.length > 0 ) {
                        $scope.term = data[0];
                        $scope.archiveType = $stateParams.archiveType;
                        document.querySelector('title').innerHTML = $scope.term.name + ' | ' + quotidiano.site_title;
                        if ($stateParams.archiveType == 'Author') {
                            $scope.archiveTitle = $scope.term.name;
                        } else {
                            $scope.archiveTitle = $scope.term.name;
                        }
                        changeCurrentNavItem();
                        var url = getArchivePosts($stateParams.archiveType, $stateParams.page, $scope.endpoints[0], $scope.term.id);
                        $http.get(url).then(function (res) {
                            var data = res.data;
                            $scope.posts = data;
                            console.log(res.headers('X-WP-Total'));
                            $scope.totalPages = res.headers('X-WP-Total');
                            $scope.isLoaded = true;
                        }, function (res, status) {
                            console.log('error');
                            if (status == 404) {
                                $scope.is404 = true;
                                console.log($scope.is404);
                            }
                        });
                    } else {
                        $scope.is404 = true;
                        $scope.isLoaded = true;
                    }

				}, function( res, status ){
				    console.log('error');
                    if ( status == 404 ) {
                        $scope.is404 = true;
                        $scope.isLoaded = true;
                        console.log('error 404');
                    }
                });
			} else {
				$http.get(url).then(function (res, status, headers) {
                    var data = res.data;
					$scope.posts = data;
                    $scope.archiveType = $stateParams.archiveType;
                    $scope.isLoaded = true;
					if ( $stateParams.archiveType == 'Search' ) {
                        document.querySelector('title').innerHTML = $scope.endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = 'Search: ' + $scope.endpoints[0];
                    } else if ( $stateParams.archiveType == 'Year' ) {
                        document.querySelector('title').innerHTML = $scope.endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle =$scope. endpoints[0];
					} else if ( $stateParams.archiveType == 'Month' ) {
                        document.querySelector('title').innerHTML = getMonthName( $scope.endpoints[1] ) + ' ' + $scope.endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = getMonthName( $scope.endpoints[1] ) + ' ' + $scope.endpoints[0];
                    } else {
                        document.querySelector('title').innerHTML = getMonthName ($scope.endpoints[1] ) + ' ' + $scope.endpoints[2] + ', ' + $scope.endpoints[0] + ' | ' + quotidiano.site_title;
                        $scope.archiveTitle = getMonthName( $scope.endpoints[1] ) + ' ' + $scope.endpoints[2] + ', ' +$scope. endpoints[0];
					}
				}, function( res, status ){
                    if ( status == 404 ) {
                        $scope.is404 = true;
                    }
                });
			}
		}])
		.controller('NotFound', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
            $scope.translations = quotidiano.translations;
            $scope.social_links = quotidiano.social_media_links;
            $scope.header_image = quotidiano.header_image;
            $scope.isMoreLoaded = true;
            jQuery('.page-home-header').hide();
            jQuery('.social-media').hide();
            showSiteTitle(false);
		}])
		.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
			$stateProvider
				.state('Home', {
					url: '/',
					controller: 'Home',
					templateUrl: quotidiano.partials + 'home.html'
				})
				.state('Category', {
					url: '/category/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Category'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
				.state('CategoryPaged', {
					url: '/category/:endpoint/page/{page:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Category',
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
				.state('Author', {
					url: '/author/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Author'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('AuthorPaged', {
                    url: '/author/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Author',
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('Tag', {
					url: '/tag/:endpoint/',
					controller: 'Archive',
					params :{
						archiveType: 'Tag'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('TagPaged', {
                    url: '/tag/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Tag'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('Search', {
					url: '/search/:endpoint',
					controller: 'Archive',
					params :{
						archiveType: 'Search'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('SearchPaged', {
                    url: '/search/:endpoint/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Search'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('SinglePost', {
					url: '/{year:int}/{month:int}/{day:int}/:slug/',
					controller: 'SinglePost',
					templateUrl: quotidiano.partials + 'single.html'
				})
				.state('ArchiveYear', {
					url: '/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Year'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveYearPaged', {
                    url: '/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Year'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('ArchiveMonth', {
					url: '/{year:int}/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Month'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveMonthPaged', {
                    url: '/{year:int}/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Month'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
				.state('ArchiveDay', {
					url: '/{year:int}/{month:int}/{endpoint:int}/',
					controller: 'Archive',
					params :{
						archiveType: 'Day'
					},
					templateUrl: quotidiano.partials + 'archive.html',
				})
                .state('ArchiveDayPaged', {
                    url: '/{year:int}/{month:int}/{endpoint:int}/page/{page:int}/',
                    controller: 'Archive',
                    params :{
                        archiveType: 'Day'
                    },
                    templateUrl: quotidiano.partials + 'archive.html',
                })
                .state('Page', {
                    url: '/{slug:string}/',
                    controller: 'Page',
                    templateUrl: quotidiano.partials + 'page.html'
                })
                .state('ChildPage', {
                    url: '/{parentSlug:string}/{slug:string}/',
                    controller: 'Page',
                    templateUrl: quotidiano.partials + 'page.html'
                })
                .state('ChildChildPage', {
                    url: '/{parentSlug:string}/{parentParentSlug:string}/{slug:string}/',
                    controller: 'Page',
                    templateUrl: quotidiano.partials + 'page.html'
                })
				.state('NotFound', {
					url: '*path',
					templateUrl: quotidiano.partials + '404.html',
					controller: 'NotFound'
				})
                .state('NotFoundMore', {
                    url: '*slug/*path',
                    templateUrl: quotidiano.partials + '404.html',
                    controller: 'NotFound'
                });

			//Enable pretty permalinks, sans the #
			$locationProvider.html5Mode(true);
		}])
		.directive('collection', function () {
			return {
				restrict: "E",
				replace: true,
				scope: {
					collection: '='
				},
				template: "<ul><member ng-repeat='member in collection' member='member'></member></ul>"
			}
		})

		.directive('member', function ($compile) {
			return {
				restrict: "E",
				replace: true,
				scope: {
					member: '='
				},
				templateUrl: quotidiano.partials + 'comments.html',
				link: function (scope, element, attrs) {
					scope.translations = quotidiano.translations;
					var collectionSt = '<collection collection="member.comment_children"></collection>';
					if (angular.isArray(scope.member.comment_children)) {
						$compile(collectionSt)(scope, function(cloned, scope)   {
							element.append(cloned);
						});
					}
				}
			}
		})
        .directive('homeLoadMore', ['$compile', '$http', function($compile, $http) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: quotidiano.partials + 'loaded-home-post.html',
                link: function($scope, element, attrs) {
                    var j = 0;
                    $scope.loadMorePosts = function() {
                        $scope.isMoreLoaded = false;
                        var ids = [];
                        jQuery('.post').each( function () {
                            ids.push(jQuery(this).attr('id').replace('post-', ''));
                            jQuery(this).removeAttr("ng-repeat");
                        });
                        var exclude = '';
                        for ( i = 0; i < ids.length; i++ ) {
                            if (i == ids.length - 1) {
                                var sep = '';
                            } else {
                                var sep = ',';
                            }

                            exclude = exclude + '' + ids[i] + sep;
                        }
                        $http.get(quotidiano.api_url + 'posts?exclude=' + exclude + '&per_page=1')
                            .then(function(result) {
                                var data = result.data;
                                var post = data[0];
                                console.log(post);
                                var date = new Date( post.date );
                                var month = date.getMonth() + 1;
                                if ( month < 10 ) {
                                    month = '0' + month;
                                }
                                console.log(exclude)
                                var year = date.getFullYear();
                                $http.get(quotidiano.api_url + 'posts?year=' + year + '&monthnum=' + month + '&per_page=31')
                                    .then(function(result) {
                                        var data = result.data;
                                        month = getMonthName( month );
                                        console.log(data);
                                        $scope.j = j;
                                        $scope.new_section_date = month + ' ' + year;
                                        $scope.new_posts = data;
                                        $compile(element)($scope, function(cloned, $scope) {
                                            element.parent().append(cloned);
                                            element.parent().append(element);
                                        });
                                        jQuery('.post').each( function() {
                                            console.log(jQuery(this).attr('ng-repeat'));
                                            jQuery(this).removeAttr("ng-repeat");
                                            jQuery(this).addClass('removed');
                                        });
                                        $scope.isMoreLoaded = true;
                                    })
                            })
                    }
                }
            }
        }])
        .directive('archiveLoadMore', ['$compile', '$http', function($compile, $http) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: quotidiano.partials + 'loaded-archive-post.html',
                link: function($scope, element, attrs) {
                    $scope.paged = 2;
                    console.log($scope.loadMorePosts);
                    $scope.loadMorePosts = function() {
                        $scope.isMoreLoaded = false;
                        jQuery('.post').each( function() {
                            jQuery(this).removeAttr("ng-repeat");
                            console.log(jQuery(this).attr('ng-repeat'));
                        });
                        var archiveType = jQuery('.archive-template').attr('id');
                        console.log($scope.$parent.endpoints);
                        var url = getArchiveUrl( archiveType, $scope.$parent.endpoints, $scope.paged  );
                        if ( archiveType == 'Category' || archiveType == 'Tag' || archiveType == 'Author' ) {
                            $http.get(url[0]).then(function (res) {
                                var data = res.data;
                                var term = data[0];
                                var url = getArchivePosts( archiveType, $scope.paged, $scope.$parent.endpoints[0], term.id );
                                $http.get(url).then(function (res) {
                                    var data = res.data;
                                    $scope.new_archive_posts = data;
                                    $compile(element)($scope, function(cloned, $scope) {
                                        element.parent().append(cloned);
                                        element.parent().append(element);
                                    });
                                    jQuery('.post').each( function() {
                                        console.log(jQuery(this).attr('ng-repeat'));
                                        jQuery(this).removeAttr("ng-repeat");
                                        jQuery(this).addClass('removed');
                                    })
                                    var totalPages = res.headers( 'X-WP-Total' );
                                    if ( $scope.paged == totalPages ) {

                                    } else {
                                        $scope.paged += 1;
                                    }
                                    $scope.isMoreLoaded = true;
                                });
                            })
                        } else {
                        	url[0] = url[0] + '&page=' + $scope.paged;
                            $http.get(url[0])
                                .then(function(res) {
                                    var data = res.data;
                                    $scope.new_archive_posts = data;
                                    $compile(element)($scope, function(cloned, $scope) {
                                        element.parent().append(cloned);
                                        element.parent().append(element);
                                    });
                                    jQuery('.post').each( function() {
                                        console.log(jQuery(this).attr('ng-repeat'));
                                        jQuery(this).removeAttr("ng-repeat");
                                        jQuery(this).addClass('removed');
                                    })
                                    var totalPages = res.headers( 'X-WP-Total' );
                                    if ( $scope.paged == totalPages ) {

                                    } else {
                                        $scope.paged += 1;
                                    }
                                    $scope.isMoreLoaded = true;
                                });
						}
                    }
                }
            }
        }])
        .directive('searchForm', function() {
            return {
                restrict: 'EA',
                template: '<input type="text" name="s" ng-model="filter.s" ng-change="search()">',
                controller: function ( $scope, $http ) {
                    $scope.filter = {
                        s: ''
                    };
                    $scope.search = function() {
                        $scope.isMoreLoaded = false;
                        $http.get(quotidiano.api_url + 'posts?search=' + $scope.filter.s + '&per_page=99').then(function(res){
                            console.log(res.data);
                            $scope.searched_posts = res.data;
                            $scope.isMoreLoaded = true;
                        });
                    };
                }
            };
        })
})();