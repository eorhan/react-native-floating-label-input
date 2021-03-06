import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  NativeModules,
  TextInputProps,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { styles } from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface Props extends TextInputProps {
  /**Style to the container of whole component*/
  containerStyles?: ViewStyle;
  /**Changes the color for hide/show password image*/
  darkTheme?: true | false | undefined;
  /**Value for the label, same as placeholder */
  label: string;
  /**Style to the label */
  labelStyles?: TextStyle;
  /**Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
  isPassword?: true | false | undefined;
  /**Callback for action submit on the keyboard */
  onSubmit?: Function;
  /**Style to the show/hide password container */
  showPasswordContainerStyles?: Object;
  /**Style to the show/hide password image */
  showPasswordImageStyles?: Object;
  /**Style to the input */
  inputStyles?: TextStyle;
  /**Path to your custom image for show/hide input */
  customShowPasswordImage?: string;
  /**Custom Style for position, size and color for label, when it's focused or blurred*/
  customLabelStyles?: {
    leftFocused: number;
    leftBlurred: number;
    topFocused: number;
    topBlurred: number;
    fontSizeFocused: number;
    fontSizeBlurred: number;
    colorFocused: string;
    colorBlurred: string;
  };
  /**Required if onFocus or onBlur is overrided*/
  isFocused?: boolean;
  /**Set a mask to your input*/
  mask?: string;
  /**Set mask type*/
  maskType?: 'currency' | 'phone' | 'date' | 'card';
  /**Set currency thousand dividers*/
  currencyDivider?: ',' | '.';
}

/**Set global styles for all your floating-label-inputs*/
const setGlobalStyles = {
  /**Set global styles to all floating-label-inputs container*/
  containerStyles: {} as ViewStyle,
  /**Set global custom styles to all floating-label-inputs labels*/
  customLabelStyles: {},
  /**Set global styles to all floating-label-inputs input*/
  inputStyles: {} as TextStyle,
  /**Set global styles to all floating-label-inputs label*/
  labelStyles: {} as TextStyle,
  /**Set global styles to all floating-label-inputs show password container*/
  showPasswordContainerStyles: {} as ViewStyle,
  /**Set global styles to all floating-label-inputs show password image*/
  showPasswordImageStyles: {} as ImageStyle,
};

interface InputRef {
  focus(): void;
  blur(): void;
}

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  props,
  ref,
) => {
  const [isFocused, setIsFocused] = useState(props.value !== '' ? true : false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);
  useEffect(() => {
    LayoutAnimation.spring();
    if (props.isFocused === undefined) {
      if (isFocused || props.value !== '') {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    } else {
      setIsFocused(props.isFocused);
    }
  }, [props.isFocused, isFocused, props.value]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    blur() {
      inputRef.current.blur();
    },
  }));

  function handleFocus() {
    LayoutAnimation.spring();
    setIsFocused(true);
  }

  function handleBlur() {
    if (props.value === '' || props.value == null) {
      LayoutAnimation.spring();
      setIsFocused(false);
    }
  }

  function setFocus() {
    inputRef.current?.focus();
  }

  function _toggleVisibility() {
    if (secureText) {
      setSecureText(false);
    } else {
      setSecureText(true);
    }
  }

  function onSubmitEditing() {
    if (props.onSubmit !== undefined) {
      props.onSubmit();
    }
  }

  let imgSource = props.darkTheme
    ? secureText
      ? makeVisibleBlack
      : makeInvisibleBlack
    : secureText
    ? makeVisibleWhite
    : makeInvisibleWhite;

  const customLabelStyles = {
    leftFocused: 15,
    leftBlurred: 15,
    topFocused: 0,
    topBlurred: '50%',
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles.customLabelStyles,
    ...props.customLabelStyles,
  };

  const style: Object = {
    zIndex: 3,
    position: 'absolute',
    left: !isFocused
      ? customLabelStyles.leftBlurred
      : customLabelStyles.leftFocused,
    top: !isFocused
      ? customLabelStyles.topBlurred
      : customLabelStyles.topFocused,
    fontSize: !isFocused
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !isFocused
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    ...setGlobalStyles.labelStyles,
    ...props.labelStyles,
  };

  const input: Object = {
    ...styles.input,
    color: customLabelStyles.colorFocused,
    ...setGlobalStyles.inputStyles,
    ...props.inputStyles,
  };

  const containerStyles: Object = {
    ...styles.container,
    ...setGlobalStyles.containerStyles,
    ...props.containerStyles,
  };

  const toggleButton = {
    ...styles.toggleButton,
    ...setGlobalStyles.showPasswordContainerStyles,
    ...props.showPasswordContainerStyles,
  };

  const img = {
    ...styles.img,
    ...setGlobalStyles.showPasswordImageStyles,
    ...props.showPasswordImageStyles,
  };

  return (
    <View style={containerStyles}>
      <Text onPress={setFocus} style={style}>
        {props.label}
      </Text>
      <TextInput
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={
          props.isPassword !== undefined
            ? props.isPassword && secureText
            : false
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        value={props.value}
        {...props}
        maxLength={props.mask !== undefined ? props.mask.length : undefined}
        onChangeText={(val: string) => {
          if (props.maskType !== undefined || props.mask !== undefined) {
            if (props.maskType !== 'currency' && props.mask !== undefined) {
              if (val.length <= props.mask.length) {
                let newValue = '';

                for (let i = 0; i < val.length; i++) {
                  if (
                    props.mask[i].match(/[^0-9A-Za-z]/) &&
                    props.mask[i] !== val[i]
                  ) {
                    newValue += props.mask[i] + val[i];
                  } else {
                    newValue += val[i];
                  }
                }
                props.onChangeText && props.onChangeText(newValue);
              }
            } else if (props.maskType === 'currency') {
              let divider = '';
              let decimal = '';
              if (props.currencyDivider === ',') {
                divider = ',';
                decimal = '.';
              } else {
                divider = '.';
                decimal = ',';
              }
              if (
                props.value !== undefined &&
                props.value.length < val.length
              ) {
                if (!val.includes(decimal)) {
                  if (val.length > 3) {
                    let arr: string[] = [];
                    let unmasked = val.replace(/[,.]/g, '');
                    for (let i = 0; i < unmasked.length; i += 3) {
                      arr.push(
                        unmasked
                          .split('')
                          .splice(unmasked.length - i, 3)
                          .join(''),
                      );
                    }

                    arr = arr.reverse();
                    arr.pop();
                    let initial = arr.join('');
                    if (unmasked.includes(initial)) {
                      unmasked = unmasked.replace(initial, '');
                    }
                    val = unmasked + divider + arr.join(divider);
                  }
                }
              }
              props.onChangeText && props.onChangeText(val);
            } else {
              props.onChangeText && props.onChangeText(val);
            }
          } else {
            props.onChangeText && props.onChangeText(val);
          }
        }}
        style={input}
      />
      {props.isPassword ? (
        <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
          <Image
            source={
              props.customShowPasswordImage !== undefined
                ? props.customShowPasswordImage
                : imgSource
            }
            resizeMode="contain"
            style={img}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};
export { setGlobalStyles };
export default forwardRef(FloatingLabelInput);
