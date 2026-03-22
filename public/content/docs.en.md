# Contents

# Errors

## Message Never Received

An error occurs when a script sends a message that no script receives. Perhaps you forgot to add the receipt of this message or selected a different message.

**Error example:**

```scratch
when green flag clicked
broadcast [level_start v]
```

*(There is no `scratch:when I receive [level_start v]` block in the project, so this message "goes into a void").*

**How to fix?**
Make sure that the correct message name is selected in the `scratch:when I receive [... v]` trigger blocks, matching the `scratch:broadcast [... v]` block.

## Unsent Message

This error is the opposite of the previous one. The script is set to wait for a message, but no script in the project sends it. Because of this, the code inside this event will never execute.

**Error example:**

```scratch
when I receive [game_end v]
stop [all]
```

*(If the `scratch:broadcast [game_end v]` block is not used anywhere in the project, the game will never stop).*

**How to fix?**
Check all `scratch:broadcast [... v]` blocks in the project. Make sure the message name in them matches the name in the wait block. If the message is no longer needed, delete the `scratch:when I receive [... v]` block.

## Variable Without Initial Value

A variable is used in a script, but it is not assigned an initial value when the project starts. This can lead to points or the player's position from a previous session being saved in a new game.

**Error example:**

```scratch
when green flag clicked
forever
  if <touching [edge v]?> then
    change (score::variables) by (1)
  end
end
```

**How to fix?**
Add a `scratch:set (score::variables) to [0]` block immediately after the `scratch:when green flag clicked` block.

```scratch
when green flag clicked
set (score::variables) to (0)
forever
  if <touching [edge v]?> then
    change (score::variables) by (1)
  end
end
```

## Literal Value Comparison

In an `if` or `repeat until` operator condition, two constant values (numbers or text) are compared instead of variables. The result of such a comparison is always the same.

**Error example:**

```scratch
if <(5) > (10)> then
  say [This will never happen]
end
```

**How to fix?**
Replace one of the values with a variable or a sensor. For example: `scratch:if <(score) > (10)> then`.

-----

# Warnings

## Empty Sprite

There is a sprite in the project that has no code blocks. This is an extra object that takes up memory.

**How to fix?**
If the sprite should be active, add scripts to it (for example, `scratch:when green flag clicked`). If it is extra, delete it.

## Unused Variable

A variable has been created in the project, but it is not used in any block.

**How to fix?**
Delete the `scratch:(my_variable)` variable in the "Variables" panel if it is not needed for the display or logic.

## Lost Code

Code blocks are in the workspace but are not attached to a "header" (event). Such code is "grayed out" and does not work.

**Warning example:**

```scratch
move (10) steps
next costume
```

*(These blocks are just lying in the field; there is no `scratch:when green flag clicked` block above them).*

**How to fix?**
Attach the blocks to the appropriate event or delete them.

## No Comments

The project lacks explanatory comments. This makes the code difficult to understand.

**How to fix?**
Right-click on the block and select "Add Comment".

```scratch
when green flag clicked // Initializing the game
set [lives] to (3)
```

## Script Overlap

Code blocks visually overlap each other. This does not affect the program's operation, but it makes it difficult for you to read.

**How to fix?**
Carefully move the scripts apart or right-click on an empty space in the script area and select **"Clean up Blocks"**.

## Script is Too Long

One script contains dozens of blocks. Such "code spaghetti" is difficult to fix.

**How to fix?**
Use "My Blocks" to move part of the logic into a separate function.

```scratch
define reset_player
go to x: (0) y: (0)
set [speed] to (0)
switch costume to [idle]

when green flag clicked
reset_player
```

## Standard Sprite Name

Names like `Sprite1` or `Спрайт1` do not say what the object does.

**How to fix?**
Rename the sprite in the field below the stage. For example, instead of `Sprite1`, write `Player` or `Ball`.
