/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { textColor } from '@wordpress/icons';
import { useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import RangeControl from '../range-control';
import CustomSelectControl from '../custom-select-control';
import VisuallyHidden from '../visually-hidden';
import ToggleControl from '../toggle-control';

const DEFAULT_FONT_SIZE = 'default';
const CUSTOM_FONT_SIZE = 'custom';

function getSelectValueFromFontSize( fontSizes, value ) {
	if ( value ) {
		const fontSizeValue = fontSizes.find(
			( font ) => font.size === Number( value )
		);
		return fontSizeValue ? fontSizeValue.slug : CUSTOM_FONT_SIZE;
	}
	return DEFAULT_FONT_SIZE;
}

function getSelectOptions( optionsArray, disableCustomFontSizes ) {
	if ( disableCustomFontSizes && ! optionsArray.length ) {
		return null;
	}
	optionsArray = [
		{ slug: DEFAULT_FONT_SIZE, name: __( 'Default' ) },
		...optionsArray,
		...( disableCustomFontSizes
			? []
			: [ { slug: CUSTOM_FONT_SIZE, name: __( 'Custom' ) } ] ),
	];
	return optionsArray.map( ( option ) => ( {
		key: option.slug,
		name: option.name,
		style: { fontSize: option.size },
	} ) );
}

export default function FontSizePicker( {
	fallbackFontSize,
	fontSizes = [],
	disableCustomFontSizes = false,
	onChange,
	value,
	withSlider = false,
} ) {
	const instanceId = useInstanceId( FontSizePicker );

	const options = useMemo(
		() => getSelectOptions( fontSizes, disableCustomFontSizes ),
		[ fontSizes, disableCustomFontSizes ]
	);

	const [ advancedFontSizing, setAdvancedFontSizing ] = useState(
		! Number.isFinite( value ) && value !== undefined
	);

	if ( ! options ) {
		return null;
	}

	const selectedFontSizeSlug = getSelectValueFromFontSize( fontSizes, value );

	const fontSizePickerNumberId = `components-font-size-picker__number#${ instanceId }`;

	const customInputProps = advancedFontSizing
		? {
				id: fontSizePickerNumberId,
				className: classnames(
					'components-font-size-picker__number',
					advancedFontSizing &&
						'components-font-size-picker__number--full-size'
				),
				onChange: ( event ) => onChange( event.target.value ),
				ariaLabel: __( 'Custom' ),
				value: value || '',
				placeholder: 'e.g. calc(2rem - 13.5px)',
		  }
		: {
				id: fontSizePickerNumberId,
				className: 'components-font-size-picker__number',
				type: 'number',
				min: 1,
				onChange: ( event ) => onChange( Number( event.target.value ) ),
				ariaLabel: __( 'Custom' ),
				value: value || '',
		  };

	return (
		<fieldset className="components-font-size-picker">
			<VisuallyHidden as="legend">{ __( 'Font size' ) }</VisuallyHidden>
			<div
				className={ classnames(
					'components-font-size-picker__controls',
					advancedFontSizing &&
						'components-font-size-picker__controls--full-size'
				) }
			>
				{ fontSizes.length > 0 && ! advancedFontSizing && (
					<CustomSelectControl
						className={ 'components-font-size-picker__select' }
						label={ __( 'Font size' ) }
						options={ options }
						value={ options.find(
							( option ) => option.key === selectedFontSizeSlug
						) }
						onChange={ ( { selectedItem } ) => {
							const selectedValue =
								selectedItem.style &&
								selectedItem.style.fontSize;
							onChange( Number( selectedValue ) );
						} }
					/>
				) }
				{ ! withSlider && ! disableCustomFontSizes && (
					<div className="components-font-size-picker__number-container">
						<label htmlFor={ fontSizePickerNumberId }>
							{ __( 'Custom' ) }
						</label>
						<input { ...customInputProps } />
					</div>
				) }
				<Button
					className="components-color-palette__clear"
					disabled={ value === undefined }
					onClick={ () => {
						onChange( undefined );
					} }
					isSmall
					isSecondary
				>
					{ __( 'Reset' ) }
				</Button>
			</div>
			<div>
				<ToggleControl
					label="Advanced font sizing"
					onChange={ () =>
						setAdvancedFontSizing( ! advancedFontSizing )
					}
					help="Toggle to activate custom font-sizing settings"
					checked={ advancedFontSizing }
				/>
			</div>
			{ withSlider && (
				<RangeControl
					className="components-font-size-picker__custom-input"
					label={ __( 'Custom Size' ) }
					value={ value || '' }
					initialPosition={ fallbackFontSize }
					onChange={ ( newValue ) => {
						onChange( newValue );
					} }
					min={ 12 }
					max={ 100 }
					beforeIcon={ textColor }
					afterIcon={ textColor }
				/>
			) }
		</fieldset>
	);
}
