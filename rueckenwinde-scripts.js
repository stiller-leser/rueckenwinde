(function ($) {
    function isMobileMenuViewport() {
        return window.matchMedia('(max-width: 1024px)').matches;
    }

    function closeAll($scope) {
        $scope.find('.menu-item-has-children.is-open')
            .removeClass('is-open')
            .children('a')
            .attr('aria-expanded', 'false');
    }

    function initMobileMenuToggles() {
        var $scopes = $('#site-navigation, #iot-menu-left, .iot-menu-left-ul');

        $scopes.each(function () {
            var $scope = $(this);
            var $parents = $scope.find('.menu-item-has-children');

            $parents.children('a').attr('aria-expanded', 'false');

            $scope.off('click.rueckenwindeMobileMenu').on('click.rueckenwindeMobileMenu', '.menu-item-has-children > a', function (evt) {
                if (!isMobileMenuViewport()) {
                    return;
                }

                var $link = $(this);
                var $item = $link.parent('.menu-item-has-children');
                var href = ($link.attr('href') || '').trim();
                var isOpen = $item.hasClass('is-open');
                var isDummyLink = href === '' || href === '#';

                if (!isOpen) {
                    evt.preventDefault();
                    $item.addClass('is-open');
                    $link.attr('aria-expanded', 'true');
                    return;
                }

                if (isDummyLink) {
                    evt.preventDefault();
                    $item.removeClass('is-open');
                    $link.attr('aria-expanded', 'false');
                }
            });

            if (isMobileMenuViewport()) {
                closeAll($scope);
            }
        });
    }

    $(document).ready(function () {
        initMobileMenuToggles();

        $(window).on('resize.rueckenwindeMobileMenu', function () {
            if (!isMobileMenuViewport()) {
                $('.menu-item-has-children.is-open')
                    .removeClass('is-open')
                    .children('a')
                    .attr('aria-expanded', 'false');
            }
        });
    });
})(jQuery);
