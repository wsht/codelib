<?php

function costTime( $func, $params )
{
	$stime = microtime( true );
	call_user_func_array( $func, $params );
	$etime = microtime( true );
	echo 'costtime' . ( $etime - $stime );

	echo "\n\n";
}

function tco( $func )
{
	$value       = null;
	$active      = false;
	$accumulated = [];

	$accumulator = function () use ( &$active, &$accumulated, $func )
	{

		array_push( $accumulated, func_get_args() );
		if ( !$active )
		{
			$active = true;
			while ( count( $accumulated ) )
			{
				$value = call_user_func_array( $func, array_shift( $accumulated ) );
				// $value = $func.bindTo(null);
				// $value = $value();
			}
			$active = false;

			return $value;
		}
	};

	return $accumulator;
}

$sum = tco( function ( $x, $y ) use ( &$sum )
{
	if ( $y > 0 )
	{
		return $sum( $x + 1, $y - 1 );
	}
	else
	{
		return $x;
	}
} );


costTime( $sum, [ 1, 10000 ] );
// $sum = tco(sum(1, 100));
// var_dump(sum(1,1000)->bindTo(null)());
// $sum1 = $sum->bindTo(null);
// $sum1();

function tailrec( $func )
{
	$accumulated = [];
	$active      = false;
	$func        = new ReflectionFunction( $func );

	return function () use ( $func, &$accumulated, &$active )
	{
		array_push( $accumulated, func_get_args() );

		if ( !$active )
		{
			$active = true;
			while ( !empty( $accumulated ) )
			{
				$ret = $func->invokeArgs( array_shift( $accumulated ) );
			}
			$active = false;

			return $ret;
		}
	};
}

$sum = tailrec( function ( $x, $y ) use ( &$sum )
{
	if ( $y > 0 )
	{
		return $sum( $x + 1, $y - 1 );
	}
	else
	{
		return $x;
	}
} );

costTime( $sum, [ 1, 10000 ] );

//there is cost most timer
class TailRecursion
{
	public $func;
	public $accumulated;
	public $recursing;

	public function tail()
	{
		return call_user_func_array( $this->func, func_get_args() );
	}

	public function getClosure( $fn )
	{
		$this->accumulated = [];
		$this->recursing   = false;
		$fn                = $fn->bindTo( $this );

		return $this->func = function () use ( $fn )
		{
			array_push( $this->accumulated, func_get_args() );
			if ( !$this->recursing )
			{
				$this->recursing = true;
				while ( !empty( $this->accumulated ) )
				{
					$ret = call_user_func_array( $fn, array_shift( $this->accumulated ) );
				}

				$this->recursing = false;

				return $ret;
			}
		};
	}
}

function tailrec2( $func )
{
	$tail = new TailRecursion();

	return $tail->getClosure( $func );
}

$sum = tailrec2( function ( $x, $y )
{
	if ( $y > 0 )
	{
		return $this->tail( $x + 1, $y - 1 );
	}
	else
	{
		return $x;
	}
} );

costTime( $sum, [ 1, 10000 ] );


/**
 * 时间消耗最少
 * @param $callback
 * @param $params
 *
 * @return mixed
 */
function trampoline( $callback, $params )
{
	$result = call_user_func_array( $callback, $params );
	while ( is_callable( $result ) )
	{
		$result = $result();
	}

	return $result;
}

function sum( $x, $y )
{
	return function () use ( $x, $y )
	{
		if ( $y > 0 )
		{
			return sum( $x + 1, $y - 1 );
		}
		else
		{
			return $x;
		}
	};
}

$stime = microtime( true );

$etime = microtime( true );
echo 'costtime' . ( $etime - $stime );
var_dump( trampoline( 'sum', array( 1, 10000 ) ) );
echo "\n\n";
